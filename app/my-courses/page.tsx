import { EnrolledCourseCard } from "@/components/EnrolledCourseCard";
import { getMyEnrolledCourses } from "@/lib/catalog";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function MyCoursesPage() {

    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id")
        .eq("user_uuid", user.id)
        .single();

    if (!student) return;

    const studentId = student.id;

    const courses = await getMyEnrolledCourses(studentId);

    return (
        <section className="pad-section">
            <div className="container">
                <div className="stack">
                    {courses.length === 0 ? (
                        <div className="empty">
                            <p className="empty-title">No enrolled courses yet</p>
                            <p className="empty-desc">Browse the catalog and enroll in a course to get started.</p>
                        </div>
                    ) : (
                        <div className="grid-cards">
                            {courses.map((course) => (
                                <EnrolledCourseCard key={course.enrollmentId} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}