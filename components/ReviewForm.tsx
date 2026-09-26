"use client"

import { useActionState } from "react";
import { submitReviewAction, type ReviewActionState } from "@/actions/reviews";

const initial: ReviewActionState = undefined;

export function ReviewForm({
    courseId,
    courseSlug,
    existingRating,
    existingComment
}: {
    courseId: number;
    courseSlug: string;
    existingRating?: number;
    existingComment?: string | null;
}) {
    const [state, formAction, pending] = useActionState(submitReviewAction, initial);

    return (
        <form action={formAction} className="stack-md panel">
            <input type="hidden" name="course_id" value={courseId} />
            <input type="hidden" name="course_slug" value={courseSlug} />

            <div className="field">
                <label className="field-label" htmlFor="rating">Your rating</label>
                <select id="rating" name="rating" className="select" defaultValue={existingRating ?? ""}>
                    <option value="" disabled>Select a rating</option>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Below average</option>
                    <option value="1">1 - Poor</option>
                </select>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="comment">Comment (optional)</label>
                <textarea id="comment" name="comment" className="input" rows={3} defaultValue={existingComment ?? ""}></textarea>
            </div>

            {state?.error ? <p className="form-error">{state.error}</p> : null}

            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Saving…" : existingRating ? "Update review" : "Submit review"}
            </button>
        </form>
    );
}