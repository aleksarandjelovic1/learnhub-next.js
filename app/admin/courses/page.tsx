import { getAllCoursesForAdmin } from "@/lib/catalog";
import { deleteCourseAction } from "@/actions/admin-courses";
import { SectionTitle } from "@/components/SectionTitle";
import Link from "next/link";

export default async function AdminCoursesPage() {
    const courses = await getAllCoursesForAdmin();

    return (
        <>
            <SectionTitle eyebrow="Admin" title="Manage Courses" description="Create, edit and publish courses." />

            <div className="admin-toolbar">
                <Link href="/admin/courses/new" className="btn btn-primary">+ New Course</Link>
            </div>

            <div className="panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.numericId}>
                                <td>{course.title}</td>
                                <td>{course.status}</td>
                                <td>{course.category}</td>
                                <td className="admin-table-actions">
                                    <Link href={`/admin/courses/${course.numericId}/edit`} className="btn-link">Edit</Link>
                                    <form action={deleteCourseAction}>
                                        <input type="hidden" name="id" value={course.numericId} />
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