import { getAllCourses, getCourseCategories, getCourseLevels } from "@/lib/data";
import { SectionTitle } from "@/components/SectionTitle";
import CoursesCatalogClient from "@/components/CoursesCatalogClient";

import { getCourseCategoriesAndLevels, getPublishedCourses } from "@/lib/catalog";

export default async function Courses() {

    const [courses, { categories, levels }] = await Promise.all([
        getPublishedCourses(),
        getCourseCategoriesAndLevels()
    ])

    return (
        <section className="pad-section">

            <div className="container">

                <div className="stack">

                    <SectionTitle
                        eyebrow="Catalog"
                        title="All Courses"
                        description="Browse every course in the catalog. Use the filters to narrow down by title, category or level.">
                    </SectionTitle>

                    <CoursesCatalogClient courses={courses} categories={categories} levels={levels}></CoursesCatalogClient>

                </div>

            </div>

        </section>
    );
}
