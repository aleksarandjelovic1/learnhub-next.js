import { getAllInstructorsForAdmin } from "@/lib/catalog";
import { deleteInstructorAction } from "@/actions/admin-instructors";
import { SectionTitle } from "@/components/SectionTitle";
import Link from "next/link";

export default async function AdminInstructorsPage() {
    const instructors = await getAllInstructorsForAdmin();

    return (
        <>
            <SectionTitle eyebrow="Admin" title="Manage Instructors" description="Add, edit and manage instructor profiles." />

            <div className="admin-toolbar">
                <Link href="/admin/instructors/new" className="btn btn-primary">+ New Instructor</Link>
            </div>

            <div className="panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Specialty</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {instructors.map((instructor) => (
                            <tr key={instructor.id}>
                                <td>{instructor.fullName}</td>
                                <td>{instructor.specialty}</td>
                                <td>{instructor.status}</td>
                                <td className="admin-table-actions">
                                    <Link href={`/admin/instructors/${instructor.id}/edit`} className="btn-link">Edit</Link>
                                    <form action={deleteInstructorAction}>
                                        <input type="hidden" name="id" value={instructor.id} />
                                        <button type="submit" className="btn-link">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}