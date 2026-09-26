import { NextResponse } from "next/server";
import { searchPublishedCourses, getPublishedCourses } from "@/lib/catalog";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    const courses = q ? await searchPublishedCourses(q) : await getPublishedCourses();

    return NextResponse.json({
        count: courses.length,
        courses
    });
}