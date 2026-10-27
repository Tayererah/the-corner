const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const IMAGEKIT_PUBLIC_KEY = "public_a9hg28ApCWY/Y4yRvVtUWOhBY54=";

export async function uploadImage(file: File): Promise<string> {
  try {
    const authRes = await fetch(`${API_BASE}/imagekit-auth/`);
    if (authRes.ok) {
      const auth = await authRes.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire);
      formData.append("token", auth.token);

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        return data.url;
      }
    }
  } catch (err) {
    console.warn("ImageKit backend auth unavailable, using offline base64 image data:", err);
  }

  // Graceful offline fallback: convert file to Base64 data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}