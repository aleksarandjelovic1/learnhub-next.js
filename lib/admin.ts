import { createServerSupabaseClient } from "@/utils/supabase/server";

export type CurrentAdmin = {
    id: number;
    fullName: string;
};

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: admin } = await supabase
        .from("admins")
        .select("id, full_name")
        .eq("user_uuid", user.id)
        .maybeSingle();

    if (!admin) return null;
    return { id: admin.id, fullName: admin.full_name };
}

export async function requireAdmin(): Promise<CurrentAdmin | null> {
    return await getCurrentAdmin();
}