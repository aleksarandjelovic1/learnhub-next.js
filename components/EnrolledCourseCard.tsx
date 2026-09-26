import Link from "next/link";
import { Badge } from "./Badge";
import type { EnrolledCourse } from "@/lib/types";
import { unenrollCourseAction, updateProgressAction } from "@/actions/enroll";

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

export function EnrolledCourseCard({ course }: { course: EnrolledCourse }) {
    return (
        <div className="card-link">
            <div className="badge-row">
                <Badge variant="brand">{course.category}</Badge>
                <Badge>{course.level}</Badge>
            </div>

            <Link href={`/courses/${course.slug}`}>
                <h3 className="card-link-title">{course.title}</h3>
            </Link>
            <p className="card-link-body">{course.shortDescription}</p>

            <div className="progress-block">
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${course.progressPercent}%` }}
                    />
                </div>
                <span className="progress-label">{course.progressPercent}% complete</span>
            </div>

            <div className="card-footer enrolled-card-footer">
                <form action={updateProgressAction} className="progress-form">
                    <input type="hidden" name="enrollment_id" value={course.enrollmentId} />
                    <select
                        name="progress_percent"
                        className="select select-sm"
                        defaultValue={course.progressPercent}
                        aria-label="Update progress"
                    >
                        {PROGRESS_STEPS.map((p) => (
                            <option key={p} value={p}>{p}%</option>
                        ))}
                    </select>
                    <button type="submit" className="btn-link">Update</button>
                </form>

                <form action={unenrollCourseAction}>
                    <input type="hidden" name="enrollment_id" value={course.enrollmentId} />
                    <button type="submit" className="btn-link btn-link-danger">Unenroll</button>
                </form>
            </div>
        </div>
    );
}