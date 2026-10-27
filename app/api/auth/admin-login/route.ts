import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const cleanUser = username.trim();

    // 1. Attempt authentication with Django REST Framework backend
    try {
      const tokenRes = await fetch(`${API_BASE}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUser, password }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const access = tokenData.access;

        // Verify staff role directly from Django /api/me/
        const meRes = await fetch(`${API_BASE}/me/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        if (meRes.ok) {
          const meData = await meRes.json();
          if (!meData.is_staff && !meData.is_superuser && meData.role !== "admin") {
            // Strictly reject non-staff users
            return NextResponse.json(
              {
                error: "Access Denied: Staff authorization required. Non-staff accounts are restricted from accessing system administration.",
                code: "NON_STAFF_REJECTED",
              },
              { status: 403 }
            );
          }

          return NextResponse.json({
            success: true,
            access: tokenData.access,
            refresh: tokenData.refresh,
            user: {
              id: meData.id,
              username: meData.username,
              role: "admin",
              is_staff: true,
            },
          });
        }
      }
    } catch (err) {
      console.warn("Django backend unavailable during admin-login, using local staff directory:", err);
    }

    // 2. Direct Staff Credentials (for development and standalone environment)
    const validStaffAccounts: Record<string, string> = {
      admin: "admin123",
      hilz_admin: "Amdatboi",
      staff: "corner2026!",
      superadmin: "gzu2026!",
    };

    const regularTestAccounts: Record<string, string> = {
      tendai_k: "student123",
      kudzai_law: "student123",
      nyasha_v: "student123",
      student: "student123",
      buyer: "buyer123",
      seller: "seller123",
    };

    // Check if user is an existing student/regular non-staff account
    if (regularTestAccounts[cleanUser.toLowerCase()]) {
      if (regularTestAccounts[cleanUser.toLowerCase()] === password) {
        return NextResponse.json(
          {
            error: "Access Denied: Staff authorization required. Non-staff accounts are restricted from accessing system administration.",
            code: "NON_STAFF_REJECTED",
          },
          { status: 403 }
        );
      }
    }

    // Check staff account match
    if (validStaffAccounts[cleanUser.toLowerCase()]) {
      if (validStaffAccounts[cleanUser.toLowerCase()] === password) {
        const staffToken = `staff-demo-token-${Date.now()}`;
        return NextResponse.json({
          success: true,
          access: staffToken,
          refresh: staffToken + "-ref",
          user: {
            id: 1,
            username: cleanUser,
            role: "admin",
            is_staff: true,
            is_superuser: true,
          },
        });
      } else {
        return NextResponse.json(
          { error: "Invalid password for administrator account." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid administrator credentials or unauthorized user." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during administrative authentication." },
      { status: 500 }
    );
  }
}
