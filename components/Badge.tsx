export function Badge({
    variant,
    children
}: {
    variant?: "default" | "brand" | "success"
    children: React.ReactNode;
}) {

    const className = variant === "brand" ? "badge badge--brand" : variant === "success" ? "badge badge--success" : "badge";

    return <span className={className}>{children}</span>;
}