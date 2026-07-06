import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!callerProfile || callerProfile.role !== "admin") {
    return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
  }

  const admin = createAdminClient();

  const [{ data: authUsers, error: listError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin.from("profiles").select("id, full_name, phone, role, created_at"),
    ]);

  if (listError || profilesError) {
    return NextResponse.json(
      { error: listError?.message ?? profilesError?.message },
      { status: 500 }
    );
  }

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const users = authUsers.users.map((u) => {
    const profile = profileById.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "",
      full_name: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      role: profile?.role ?? "customer",
      created_at: profile?.created_at ?? u.created_at,
    };
  });

  return NextResponse.json({ users });
}
