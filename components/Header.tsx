import { signOutAction } from "@/actions/auth";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";

export async function Header() {

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    let studentName: string | null = null;

    if (user) {
        const { data: admin } = await supabase
            .from("admins")
            .select("id")
            .eq("user_uuid", user.id)
            .maybeSingle();

        isAdmin = !!admin;

        if (!isAdmin) {
            const { data: student } = await supabase
                .from("students")
                .select("full_name")
                .eq("user_uuid", user.id)
                .maybeSingle();

            studentName = student?.full_name ?? null;
        }
    }

    return (
        <header className="site-header">

            <div className="container site-header-inner">

                <Link href="/" className="site-logo">
                    <span className="site-logo-mark">L</span>
                    <span>LearnHub</span>
                </Link>

                <form action="/search" method="get" className="header-search">
                    <input
                        type="search"
                        name="q"
                        id="header-search-q"
                        placeholder="Search courses..."
                        className="input header-search-input"
                        autoComplete="off"
                    />

                    <button type="submit" className="btn btn-primary btn-sm">Search</button>
                </form>

                <nav className="site-nav">
                    <a href="/" className="site-nav-link">Home</a>
                    <a href="/courses" className="site-nav-link">Courses</a>
                    <a href="/instructors" className="site-nav-link">Instructors</a>

                    {
                        user ? (
                            <>
                                {isAdmin ? (
                                    <>
                                        <a href="/admin/courses" className="site-nav-link">Manage Courses</a>
                                        <a href="/admin/instructors" className="site-nav-link">Manage Instructors</a>
                                    </>
                                ) : (
                                    <>
                                        <a href="/my-courses" className="site-nav-link">My Courses</a>
                                        {studentName ? (
                                            <span className="nav-user-name">{studentName}</span>
                                        ) : null}
                                    </>
                                )}
                                <form action={signOutAction}>
                                    <button type="submit" className="site-nav-link-btn">Logout</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <a href="/login" className="site-nav-link">Login</a>
                                <a href="/register" className="site-nav-link">Register</a>
                            </>
                        )
                    }
                </nav>
            </div>

        </header>
    )
}