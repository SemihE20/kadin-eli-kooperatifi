import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
  }

  if (!process.env.REMOVE_BG_API_KEY) {
    return NextResponse.json(
      { error: "Sunucuda REMOVE_BG_API_KEY tanımlı değil." },
      { status: 500 }
    );
  }

  const incomingForm = await request.formData();
  const file = incomingForm.get("image_file");

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Görsel dosyası bulunamadı." }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (file.type && !allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: `Desteklenmeyen görsel formatı (${file.type || "bilinmiyor"}). Lütfen JPEG, PNG veya WebP kullanın.` },
      { status: 400 }
    );
  }

  // Forward the file's real name/type — remove.bg detects the format from
  // these, so lying about it (e.g. always calling it "image.png") causes
  // spurious "Invalid file type" errors for non-PNG uploads.
  const originalName = file instanceof File && file.name ? file.name : "image.jpg";

  const removeBgForm = new FormData();
  removeBgForm.append("image_file", file, originalName);
  removeBgForm.append("size", "auto");

  let removeBgRes: Response;
  try {
    removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY },
      body: removeBgForm,
    });
  } catch {
    return NextResponse.json(
      { error: "remove.bg servisine ulaşılamadı." },
      { status: 502 }
    );
  }

  if (!removeBgRes.ok) {
    let message = "Arka plan kaldırılamadı.";
    try {
      const errJson = await removeBgRes.json();
      message = errJson?.errors?.[0]?.title ?? message;
    } catch {
      // ignore parse failure, use default message
    }
    return NextResponse.json({ error: message }, { status: removeBgRes.status });
  }

  const imageBuffer = await removeBgRes.arrayBuffer();
  return new NextResponse(imageBuffer, {
    headers: { "Content-Type": "image/png" },
  });
}
