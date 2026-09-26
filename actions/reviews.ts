"use server"

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { reviewSchema, firstIssueMessage } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ReviewActionState = { error?: string } | undefined;

export async function submitReviewAction(
    _prev: ReviewActionState,
    formData: FormData
): Promise<ReviewActionState> {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const courseId = Number(formData.get("course_id"));
    const courseSlug = String(formData.get("course_slug"));

    const parsed = reviewSchema.safeParse({
        rating: formData.get("rating"),
        comment: formData.get("comment")
    });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_uuid", user.id)
        .maybeSingle();

    if (!student) return { error: "Only students can leave reviews." };

    const { error } = await supabase
        .from("reviews")
        .upsert(
            {
                student_id: student.id,
                course_id: courseId,
                rating: parsed.data.rating,
                comment: parsed.data.comment || null
            },
            { onConflict: "student_id,course_id" }
        );

    if (error) return { error: error.message };

    revalidatePath(`/courses/${courseSlug}`);
    return undefined;
}

export async function deleteReviewAction(formData: FormData) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const reviewId = Number(formData.get("review_id"));
    const courseSlug = String(formData.get("course_slug"));

    await supabase.from("reviews").delete().eq("id", reviewId);

    revalidatePath(`/courses/${courseSlug}`);
}