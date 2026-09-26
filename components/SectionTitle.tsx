export function SectionTitle({
    eyebrow,
    title,
    description
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="section-head">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="title-page">{title}</h2>
            <p className="text-muted max-prose">{description}</p>
        </div>
    )
}