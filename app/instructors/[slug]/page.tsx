import { CourseCard } from "@/components/CourseCard";
import { getInstructorBySlug, getPublishedCoursesByInstructorSlug } from "@/lib/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { initials } from "@/lib/avatar";

export default async function InstructorDetailPage({
    params
}: {
    params: Promise<{ slug: string }>;
}) {

    const { slug } = await params;

    const instructors = await getInstructorBySlug(slug);
    if (!instructors) notFound();

    const taughtCourses = await getPublishedCoursesByInstructorSlug(instructors.slug);

    return (
        <section className="pad-section">
            <div className="container">
                <nav className="back-nav">
                    <Link href="/instructors">Back to instructors</Link>
                </nav>

                <div className="profile-hero">
                    <div className="avatar avatar-lg">{initials(instructors.name)}</div>
                    <div className="profile-body">
                        <p className="eyebrow">{instructors.specialty}</p>
                        <h1 className="title-display">{instructors.name}</h1>
                        <p className="text-muted-sm max-prose">{instructors.bio}</p>
                    </div>
                </div>

                <div className="courses-below">
                    <h2 className="title-section">
                        Courses by {instructors.name.split(" ")[0]}
                    </h2>

                    {taughtCourses.length === 0 ? (
                        <span>No courses</span>
                    ) : (
                        <div className="grid-cards mt-sm">
                            {taughtCourses.map((course) => (
                                <CourseCard key={course.id} course={course} instructorName={course.instructorName}></CourseCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}