import { NextRequest, NextResponse } from "next/server";

export interface PurchaseNotification {
  id: string;
  orderReference: string;
  listingId: number;
  listingTitle: string;
  price: string;
  category: string;
  meetupZone: string;
  paymentMethod: "cash" | "ecocash";
  buyerUsername: string;
  buyerPhone: string;
  notes?: string;
  sellerUsername: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

// In-memory persistent notification cache during server runtime
// Global variable across hot reloads in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __CORNER_NOTIFICATIONS__: PurchaseNotification[] | undefined;
}

if (!global.__CORNER_NOTIFICATIONS__) {
  global.__CORNER_NOTIFICATIONS__ = [
    {
      id: "demo-notif-1",
      orderReference: "TC-849201",
      listingId: 1,
      listingTitle: "Casio fx-991EX Scientific Calculator",
      price: "25",
      category: "electronics",
      meetupZone: "Main Campus — Library Quad (Recommended)",
      paymentMethod: "cash",
      buyerUsername: "kudzai_law",
      buyerPhone: "+263 77 412 8890",
      notes: "Can meet around 2 PM after lectures.",
      sellerUsername: "tinashe_m",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    },
  ];
}

const NOTIFICATIONS = global.__CORNER_NOTIFICATIONS__;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seller = searchParams.get("seller")?.trim().toLowerCase();

  let results = [...NOTIFICATIONS];
  if (seller) {
    results = results.filter(
      (n) =>
        n.sellerUsername.toLowerCase() === seller ||
        n.sellerUsername.toLowerCase() === `@${seller}` ||
        `@${n.sellerUsername.toLowerCase()}` === seller
    );
  }

  // Sort descending by date
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    count: results.length,
    notifications: results,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderReference,
      listingId,
      listingTitle,
      price,
      category,
      meetupZone,
      paymentMethod,
      buyerUsername,
      buyerPhone,
      notes,
      sellerUsername,
    } = body;

    if (!listingTitle || !sellerUsername) {
      return NextResponse.json(
        { error: "Listing title and seller username are required." },
        { status: 400 }
      );
    }

    const newNotification: PurchaseNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderReference: orderReference || `TC-${Math.floor(100000 + Math.random() * 900000)}`,
      listingId: Number(listingId) || 0,
      listingTitle,
      price: String(price || "0"),
      category: category || "general",
      meetupZone: meetupZone || "Main Campus Quad",
      paymentMethod: paymentMethod === "ecocash" ? "ecocash" : "cash",
      buyerUsername: buyerUsername || "Anonymous Student",
      buyerPhone: buyerPhone || "",
      notes: notes || "",
      sellerUsername: sellerUsername.replace(/^@/, ""),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    NOTIFICATIONS.unshift(newNotification);

    return NextResponse.json({
      success: true,
      message: "Purchase request notification sent to seller.",
      notification: newNotification,
    });
  } catch (err) {
    console.error("Failed to post notification:", err);
    return NextResponse.json(
      { error: "Internal server error creating notification." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const notif = NOTIFICATIONS.find((n) => n.id === id);
    if (!notif) {
      return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }

    if (status === "accepted" || status === "declined" || status === "pending") {
      notif.status = status;
    }

    return NextResponse.json({ success: true, notification: notif });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update notification." }, { status: 500 });
  }
}
