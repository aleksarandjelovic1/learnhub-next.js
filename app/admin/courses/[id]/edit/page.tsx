import { updateCourseAction } from "@/actions/admin-courses";
import { getCourseByIdForAdmin, getInstructorsPublic } from "@/lib/catalog";
import { CourseForm } from "@/components/admin/CourseForm";
import { SectionTitle } from "@/components/SectionTitle";
import { notFound } from "next/navigation";

export default async function EditCoursePage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [course, instructors] = await Promise.all([
        getCourseByIdForAdmin(Number(id)),
        getInstructorsPublic()
    ]);

    if (!course) notFound();

    return (
        <>
            <SectionTitle eyebrow="Admin" title="Edit Course" description={course.title} />
            <CourseForm action={updateCourseAction} instructors={instructors} course={course} submitLabel="Save Changes" />
        </>
    );
}