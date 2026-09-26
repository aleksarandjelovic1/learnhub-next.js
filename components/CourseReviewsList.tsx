import type { CourseReview } from "@/lib/types";

function stars(rating: number): string {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function CourseReviewsList({ reviews }: { reviews: CourseReview[] }) {
    if (reviews.length === 0) {
        return <p className="text-muted-sm">No reviews yet. Be the first to leave one.</p>;
    }

    return (
        <div className="stack-md">
            {reviews.map((review) => (
                <div key={review.id} className="panel">
                    <div className="review-header">
                        <span className="review-stars">{stars(review.rating)}</span>
                        <span className="text-muted-sm">{review.studentName}</span>
                    </div>
                    {review.comment ? <p className="review-comment">{review.comment}</p> : null}
                </div>
            ))}
        </div>
    );
}