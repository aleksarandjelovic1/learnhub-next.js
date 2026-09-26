import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const admin = await requireAdmin();
    if (!admin) redirect("/");

    return (
        <section className="pad-section">
            <div className="container">
                <div className="stack">{children}</div>
            </div>
        </section>
    );
}