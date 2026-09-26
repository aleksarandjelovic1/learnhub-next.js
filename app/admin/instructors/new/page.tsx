import { createInstructorAction } from "@/actions/admin-instructors";
import { InstructorForm } from "@/components/admin/InstructorForm";
import { SectionTitle } from "@/components/SectionTitle";

export default function NewInstructorPage() {
    return (
        <>
            <SectionTitle eyebrow="Admin" title="New Instructor" description="Fill in the details below." />
            <InstructorForm action={createInstructorAction} submitLabel="Create Instructor" />
        </>
    );
}