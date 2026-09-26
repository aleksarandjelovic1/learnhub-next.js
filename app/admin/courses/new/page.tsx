import { createCourseAction } from "@/actions/admin-courses";
import { getInstructorsPublic } from "@/lib/catalog";
import { CourseForm } from "@/components/admin/CourseForm";
import { SectionTitle } from "@/components/SectionTitle";

export default async function NewCoursePage() {
    const instructors = await getInstructorsPublic();

    return (
        <>
            <SectionTitle eyebrow="Admin" title="New Course" description="Fill in the details below." />
            <CourseForm action={createCourseAction} instructors={instructors} submitLabel="Create Course" />
        </>
    );
}