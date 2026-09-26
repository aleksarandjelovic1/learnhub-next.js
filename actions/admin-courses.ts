"use server"

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { courseSchema, firstIssueMessage } from "@/lib/validation";

export type CourseFormState = { error?: string } | undefined;

function readCourseFields(formData: FormData) {
    return {
        title: String(formData.get("title") ?? "").trim(),
        category: String(formData.get("category") ?? "").trim(),
        level: String(formData.get("level") ?? "").trim(),
        status: String(formData.get("status") ?? "draft").trim(),
        price: Number(formData.get("price") ?? 0),
        duration: String(formData.get("duration") ?? "").trim() || null,
        short_description: String(formData.get("short_description") ?? "").trim() || null,
        description: String(formData.get("description") ?? "").trim(),
        instructor_id: formData.get("instructor_id")
            ? Number(formData.get("instructor_id"))
            : null
    };
}

export async function createCourseAction(
    _prev: CourseFormState,
    formData: FormData
): Promise<CourseFormState> {
    const admin = await requireAdmin();
    if (!admin) return { error: "Not authorized." };

    const parsed = courseSchema.safeParse(readCourseFields(formData));
    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }
    const fields = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("courses").insert({
        ...fields,
        slug: slugify(fields.title),
        price: Number.isFinite(fields.price) ? fields.price : 0
    });

    if (error) return { error: error.message };

    revalidatePath("/courses");
    revalidatePath("/admin/courses");
    redirect("/admin/courses");
}

export async function updateCourseAction(
    _prev: CourseFormState,
    formData: FormData
): Promise<CourseFormState> {
    const admin = await requireAdmin();
    if (!admin) return { error: "Not authorized." };

    const id = Number(formData.get("id"));
    const parsed = courseSchema.safeParse(readCourseFields(formData));
    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }
    const fields = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
        .from("courses")
        .update({ ...fields, price: Number.isFinite(fields.price) ? fields.price : 0 })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/courses");
    revalidatePath(`/courses/${id}`);
    revalidatePath("/admin/courses");
    redirect("/admin/courses");
}

export async function deleteCourseAction(formData: FormData) {
    const admin = await requireAdmin();
    if (!admin) return;

    const id = Number(formData.get("id"));
    const supabase = await createServerSupabaseClient();
    await supabase.from("courses").delete().eq("id", id);

    revalidatePath("/courses");
    revalidatePath("/admin/courses");
}