import { updateInstructorAction } from "@/actions/admin-instructors";
import { getInstructorByIdForAdmin } from "@/lib/catalog";
import { InstructorForm } from "@/components/admin/InstructorForm";
import { SectionTitle } from "@/components/SectionTitle";
import { notFound } from "next/navigation";

export default async function EditInstructorPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const instructor = await getInstructorByIdForAdmin(Number(id));
    if (!instructor) notFound();

    return (
        <>
            <SectionTitle eyebrow="Admin" title="Edit Instructor" description={instructor.fullName} />
            <InstructorForm action={updateInstructorAction} instructor={instructor} submitLabel="Save Changes" />
        </>
    );
}