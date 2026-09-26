import { enrollCourseAction } from "@/actions/enroll";
import { Badge } from "@/components/Badge";
import { ReviewForm } from "@/components/ReviewForm";
import { CourseReviewsList } from "@/components/CourseReviewsList";
import {
    getCourseBySlug,
    getCourseReviews,
    getCourseRatingSummary,
    getMyReviewForCourse
} from "@/lib/catalog";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const course = await getCourseBySlug(slug);
    if (!course) notFound();

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    let enrolled = false;
    let isAdmin = false;
    let skillMismatch = false;
    let myReview: { id: number; rating: number; comment: string | null } | null = null;

    if (user) {
        const { data: admin } = await supabase
            .from("admins")
            .select("id")
            .eq("user_uuid", user.id)
            .maybeSingle();

        isAdmin = !!admin;

        if (!isAdmin) {
            const { data: student } = await supabase
                .from("students")
                .select("id, skill_level")
                .eq("user_uuid", user.id)
                .maybeSingle();

            if (student) {
                const { data: enrollmentRow } = await supabase
                    .from("enrollments")
                    .select("id")
                    .eq("student_id", student.id)
                    .eq("course_id", course.id)
                    .maybeSingle();

                if (enrollmentRow) {
                    enrolled = true;
                }

                const levelRank: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
                const studentRank = levelRank[student.skill_level] ?? 0;
                const courseRank = levelRank[course.level] ?? 0;

                skillMismatch = studentRank > 0 && courseRank > studentRank;

                myReview = await getMyReviewForCourse(student.id, course.id);
            }
        }
    }

    const [reviews, ratingSummary] = await Promise.all([
        getCourseReviews(course.id),
        getCourseRatingSummary(course.id)
    ]);

    const instructor = course.instructor;

    return (
        <section className="pad-section">
            <div className="container">
                <nav className="back-nav">
                    <Link href="/courses">Back to Courses</Link>
                </nav>

                <div className="course-layout">
                    <div>
                        <div className="badge-row">
                            <Badge variant="brand">{course.category}</Badge>
                            <Badge>{course.level}</Badge>
                            {course.duration && <Badge variant="success">{course.duration}</Badge>}
                        </div>

                        <h1 className="title-display">{course.title}</h1>

                        {ratingSummary.count > 0 ? (
                            <p className="text-muted-sm mt-sm">
                                ★ {ratingSummary.average} ({ratingSummary.count} review{ratingSummary.count === 1 ? "" : "s"})
                            </p>
                        ) : null}

                        <p className="course-lede">{course.shortDescription}</p>

                        <div className="text-block">
                            <h2>About this course</h2>
                            <p>{course.description}</p>
                        </div>

                        <div className="lesson-block">
                            <h2 className="title-section">Reviews</h2>

                            {user && !isAdmin && enrolled ? (
                                <div className="mt-sm">
                                    <ReviewForm
                                        courseId={course.id}
                                        courseSlug={course.slug}
                                        existingRating={myReview?.rating}
                                        existingComment={myReview?.comment}
                                    />
                                </div>
                            ) : null}

                            <div className="mt-sm">
                                <CourseReviewsList reviews={reviews} />
                            </div>
                        </div>
                    </div>

                    <aside className="course-aside">
                        <div className="sidebar-card">
                            <p className="sidebar-label">At a glance</p>
                            <dl className="meta-grid">
                                <div>
                                    <dt>Level</dt>
                                    <dd>{course.level}</dd>
                                </div>
                                <div>
                                    <dt>Category</dt>
                                    <dd>{course.category}</dd>
                                </div>
                                {course.duration && (
                                    <div>
                                        <dt>Duration</dt>
                                        <dd>{course.duration}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {user && !isAdmin ? (
                            <div className="sidebar-card">
                                {enrolled ? (
                                    <p className="text-success font-semibold">Already enrolled</p>
                                ) : (
                                    <>
                                        {skillMismatch ? (
                                            <p className="skill-hint">
                                                This course is marked as {course.level}. Some prior experience is recommended.
                                            </p>
                                        ) : null}
                                        <form action={enrollCourseAction}>
                                            <input type="hidden" name="course_id" value={course.id} />
                                            <button type="submit" className="btn btn-primary w-full">Enroll</button>
                                        </form>
                                    </>
                                )}
                            </div>
                        ) : null}

                        {instructor ? (
                            <div className="sidebar-card">
                                <p className="sidebar-label">Instructor</p>
                                <p className="sidebar-instructor-name">{instructor.name}</p>
                                <p className="sidebar-instructor-role">{instructor.specialty}</p>
                                {instructor.shortBio && (
                                    <p className="text-muted-sm mt-sm">{instructor.shortBio}</p>
                                )}
                                <Link
                                    href={`/instructors/${instructor.slug}`}
                                    className="link-brand is-block mt-sm"
                                >
                                    View profile
                                </Link>
                            </div>
                        ) : null}
                    </aside>
                </div>
            </div>
        </section>
    );
}