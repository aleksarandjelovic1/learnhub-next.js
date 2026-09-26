"use client"

import { useActionState } from "react";
import type { AdminInstructorRow } from "@/lib/catalog";
import type { InstructorFormState } from "@/actions/admin-instructors";

const initial: InstructorFormState = undefined;

export function InstructorForm({
    action,
    instructor,
    submitLabel
}: {
    action: (prevState: InstructorFormState, formData: FormData) => Promise<InstructorFormState>;
    instructor?: AdminInstructorRow;
    submitLabel: string;
}) {
    const [state, formAction, pending] = useActionState(action, initial);

    return (
        <form action={formAction} className="stack-md panel">
            {instructor ? <input type="hidden" name="id" value={instructor.id} /> : null}

            <div className="field">
                <label className="field-label" htmlFor="full_name">Full name</label>
                <input id="full_name" className="input" type="text" name="full_name" defaultValue={instructor?.fullName} required />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="email">Email</label>
                <input id="email" className="input" type="email" name="email" defaultValue={instructor?.email} required />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="specialty">Specialty</label>
                <input id="specialty" className="input" type="text" name="specialty" defaultValue={instructor?.specialty} />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="status">Status</label>
                <select id="status" className="select" name="status" defaultValue={instructor?.status ?? "active"}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="short_bio">Short bio</label>
                <input id="short_bio" className="input" type="text" name="short_bio" defaultValue={instructor?.shortBio} />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="bio">Full bio</label>
                <textarea id="bio" className="input" name="bio" rows={5} defaultValue={instructor?.bio}></textarea>
            </div>

            {state?.error ? <p className="form-error">{state.error}</p> : null}

            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Saving…" : submitLabel}
            </button>
        </form>
    );
}