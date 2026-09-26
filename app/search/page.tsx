import { CourseCard } from "@/components/CourseCard";
import { SectionTitle } from "@/components/SectionTitle";
import { searchPublishedCourses } from "@/lib/catalog";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const sp = await searchParams;
    const raw = sp.q;
    const trimmed = raw ? raw.trim() : "";

    const courses = trimmed ? await searchPublishedCourses(trimmed) : [];

    return (
        <section className="pad-section">
            <div className="container">
                <div className="stack">
                    <SectionTitle
                        eyebrow="Search"
                        title={trimmed ? `Results for "${trimmed}"` : "Search courses"}
                        description={
                            trimmed
                                ? `Found ${courses.length} course${courses.length === 1 ? "" : "s"}.`
                                : "Enter a search term to find courses."
                        }>
                    </SectionTitle>

                    {trimmed && courses.length === 0 ? (
                        <div className="empty">
                            <p className="empty-title">No courses found</p>
                            <p className="empty-desc">Try a different search term.</p>
                        </div>
                    ) : (
                        <div className="grid-cards">
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    instructorName={course.instructorName}>
                                </CourseCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}