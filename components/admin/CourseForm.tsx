"use client"

import { useActionState } from "react";
import type { InstructorPublic } from "@/lib/types";
import type { AdminCourseRow } from "@/lib/catalog";
import type { CourseFormState } from "@/actions/admin-courses";

const initial: CourseFormState = undefined;

export function CourseForm({
    action,
    instructors,
    course,
    submitLabel
}: {
    action: (prevState: CourseFormState, formData: FormData) => Promise<CourseFormState>;
    instructors: InstructorPublic[];
    course?: AdminCourseRow;
    submitLabel: string;
}) {
    const [state, formAction, pending] = useActionState(action, initial);

    return (
        <form action={formAction} className="stack-md panel">
            {course ? <input type="hidden" name="id" value={course.numericId} /> : null}

            <div className="field">
                <label className="field-label" htmlFor="title">Title</label>
                <input id="title" className="input" type="text" name="title" defaultValue={course?.title} required />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="category">Category</label>
                <input id="category" className="input" type="text" name="category" defaultValue={course?.category} required />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="level">Level</label>
                <select id="level" className="select" name="level" defaultValue={course?.level ?? "beginner"}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="status">Status</label>
                <select id="status" className="select" name="status" defaultValue={course?.status ?? "draft"}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="price">Price</label>
                <input id="price" className="input" type="number" step="0.01" name="price" defaultValue={course?.price ?? 0} />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="duration">Duration</label>
                <input id="duration" className="input" type="text" name="duration" placeholder="e.g. 4 weeks" defaultValue={course?.duration ?? ""} />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="instructor_id">Instructor</label>
                <select
                    id="instructor_id"
                    className="select"
                    name="instructor_id"
                    defaultValue={course?.instructorId != null ? String(course.instructorId) : ""}
                >
                    <option value="">No instructor</option>
                    {instructors.map((i) => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="short_description">Short description</label>
                <input id="short_description" className="input" type="text" name="short_description" defaultValue={course?.shortDescription ?? ""} />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="description">Description</label>
                <textarea id="description" className="input" name="description" rows={5} defaultValue={course?.description ?? ""} required />
            </div>

            {state?.error ? <p>{state.error}</p> : null}

            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Saving…" : submitLabel}
            </button>
        </form>
    );
}