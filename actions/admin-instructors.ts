"use server"

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { instructorSchema, firstIssueMessage } from "@/lib/validation";

export type InstructorFormState = { error?: string } | undefined;

function readInstructorFields(formData: FormData) {
    return {
        full_name: String(formData.get("full_name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        specialty: String(formData.get("specialty") ?? "").trim(),
        status: String(formData.get("status") ?? "active").trim(),
        short_bio: String(formData.get("short_bio") ?? "").trim() || null,
        bio: String(formData.get("bio") ?? "").trim() || null
    };
}

export async function createInstructorAction(
    _prev: InstructorFormState,
    formData: FormData
): Promise<InstructorFormState> {
    const admin = await requireAdmin();
    if (!admin) return { error: "Not authorized." };

    const parsed = instructorSchema.safeParse(readInstructorFields(formData));
    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }
    const fields = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("instructors").insert({
        ...fields,
        slug: slugify(fields.full_name)
    });

    if (error) return { error: error.message };

    revalidatePath("/instructors");
    revalidatePath("/admin/instructors");
    redirect("/admin/instructors");
}

export async function updateInstructorAction(
    _prev: InstructorFormState,
    formData: FormData
): Promise<InstructorFormState> {
    const admin = await requireAdmin();
    if (!admin) return { error: "Not authorized." };

    const id = Number(formData.get("id"));
    const parsed = instructorSchema.safeParse(readInstructorFields(formData));
    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }
    const fields = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
        .from("instructors")
        .update(fields)
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/instructors");
    revalidatePath("/admin/instructors");
    redirect("/admin/instructors");
}

export async function deleteInstructorAction(formData: FormData) {
    const admin = await requireAdmin();
    if (!admin) return;

    const id = Number(formData.get("id"));
    const supabase = await createServerSupabaseClient();
    await supabase.from("instructors").delete().eq("id", id);

    revalidatePath("/instructors");
    revalidatePath("/admin/instructors");
}