"use server"

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function enrollCourseAction(formData: FormData) {
    const rawId = Number(formData.get("course_id"));

    if (!Number.isFinite(rawId) || rawId <= 0) {
        throw new Error("Invalid course.");
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: admin } = await supabase
        .from("admins")
        .select("id")
        .eq("user_uuid", user.id)
        .maybeSingle();

    if (admin) {
        throw new Error("Admins cannot enroll in courses.");
    }

    let { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_uuid", user.id)
        .maybeSingle();

    if (!student) {
        const fullName = user.user_metadata?.full_name || "Student";

        const { data: newStudent, error: createError } = await supabase
            .from("students")
            .insert({
                user_uuid: user.id,
                full_name: fullName
            })
            .select("id")
            .single();

        if (createError || !newStudent) {
            console.error(createError);
            throw new Error("Failed to create student profile: " + createError?.message);
        }

        student = newStudent;
    }

    const { error: insertError } = await supabase
        .from("enrollments")
        .insert({
            student_id: student.id,
            course_id: rawId
        });

    if (insertError) {
        console.error(insertError);
        throw new Error("Failed to enroll in course: " + insertError.message);
    }

    revalidatePath("/courses");
    revalidatePath("/my-courses");

    redirect("/my-courses");
}

export async function unenrollCourseAction(formData: FormData) {
    const enrollmentId = Number(formData.get("enrollment_id"));

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", enrollmentId);

    if (error) {
        console.error(error);
        throw new Error("Failed to unenroll: " + error.message);
    }

    revalidatePath("/my-courses");
}

export async function updateProgressAction(formData: FormData) {
    const enrollmentId = Number(formData.get("enrollment_id"));
    const progress = Number(formData.get("progress_percent"));

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { error } = await supabase
        .from("enrollments")
        .update({ progress_percent: progress })
        .eq("id", enrollmentId);

    if (error) {
        console.error(error);
        throw new Error("Failed to update progress: " + error.message);
    }

    revalidatePath("/my-courses");
}
