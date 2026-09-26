import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { CatalogCourse, CourseDetail, CourseReview, EnrolledCourse, InstructorPublic } from "@/lib/types";

type InstructorRow = {
  id: number;
  slug: string;
  full_name: string;
  specialty: string;
  short_bio: string | null;
  bio: string | null;
};

type CourseRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  level: string;
  status: string;
  description: string;
  short_description: string | null;
  duration: string | null;
  instructor: InstructorRow | InstructorRow[] | null;
};

function pickInstructor(
  ins: InstructorRow | InstructorRow[] | null | undefined,
): InstructorRow | null {
  if (ins == null) return null;
  return Array.isArray(ins) ? ins[0] ?? null : ins;
}

const courseSelect = `
  id,
  slug,
  title,
  category,
  level,
  status,
  description,
  short_description,
  duration,
  instructor:instructors (
    id,
    slug,
    full_name,
    specialty,
    short_bio,
    bio
  )
` as const;

function mapCourseRow(row: CourseRow): CatalogCourse {
  const ins = pickInstructor(row.instructor);
  const name = ins?.full_name?.trim() || "TBA";
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    shortDescription:
      row.short_description?.trim() ||
      row.description.slice(0, 160).trim() + (row.description.length > 160 ? "…" : ""),
    description: row.description,
    category: row.category,
    level: row.level,
    duration: row.duration,
    instructorName: name,
    instructorSlug: ins?.slug ?? null,
  };
}

function mapDetail(row: CourseRow): CourseDetail {
  const base = mapCourseRow(row);
  const ins = pickInstructor(row.instructor);
  return {
    ...base,
    numericId: row.id,
    instructor: ins
      ? {
        id: String(ins.id),
        slug: ins.slug,
        name: ins.full_name,
        specialty: ins.specialty,
        shortBio: ins.short_bio?.trim() || "",
        bio: ins.bio?.trim() || "",
      }
      : null,
  };
}

export async function getPublishedCourses(): Promise<CatalogCourse[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select(courseSelect)
    .eq("status", "published")
    .order("title");

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as CourseRow[]).map(mapCourseRow);
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select(courseSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapDetail(data as unknown as CourseRow);
}

export async function searchPublishedCourses(q: string): Promise<CatalogCourse[]> {
  const needle = q.trim();
  if (!needle) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select(courseSelect)
    .eq("status", "published")
    .ilike("title", `%${needle}%`)
    .order("title");

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as CourseRow[]).map(mapCourseRow);
}

export async function getCourseCategoriesAndLevels(): Promise<{
  categories: string[];
  levels: string[];
}> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("category, level")
    .eq("status", "published");

  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const categories = Array.from(new Set(rows.map((r) => r.category))).sort();
  const levels = Array.from(new Set(rows.map((r) => r.level))).sort();
  return { categories, levels };
}

export async function getInstructorsPublic(): Promise<InstructorPublic[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("instructors")
    .select("id, slug, full_name, specialty, short_bio, bio")
    .eq("status", "active")
    .order("full_name");

  if (error) throw new Error(error.message);
  return (
    data?.map((r) => ({
      id: String(r.id),
      slug: r.slug,
      name: r.full_name,
      specialty: r.specialty,
      shortBio: r.short_bio?.trim() || "",
      bio: r.bio?.trim() || "",
    })) ?? []
  );
}

export async function getInstructorBySlug(
  slug: string,
): Promise<InstructorPublic | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("instructors")
    .select("id, slug, full_name, specialty, short_bio, bio")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: String(data.id),
    slug: data.slug,
    name: data.full_name,
    specialty: data.specialty,
    shortBio: data.short_bio?.trim() || "",
    bio: data.bio?.trim() || "",
  };
}

export async function getPublishedCoursesByInstructorSlug(
  instructorSlug: string,
): Promise<CatalogCourse[]> {
  const supabase = await createServerSupabaseClient();
  const { data: ins, error: e1 } = await supabase
    .from("instructors")
    .select("id")
    .eq("slug", instructorSlug)
    .eq("status", "active")
    .maybeSingle();

  if (e1) throw new Error(e1.message);
  if (!ins) return [];

  const { data, error } = await supabase
    .from("courses")
    .select(courseSelect)
    .eq("status", "published")
    .eq("instructor_id", ins.id)
    .order("title");

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as CourseRow[]).map(mapCourseRow);
}

type EnrolledRow = {
  id: number;
  enrolled_at: string;
  progress_percent: number;
  courses: CourseRow | CourseRow[] | null;
};

function pickCourse(
  c: CourseRow | CourseRow[] | null | undefined,
): CourseRow | null {
  if (c == null) return null;
  return Array.isArray(c) ? c[0] ?? null : c;
}

export async function getMyEnrolledCourses(studentId: number): Promise<EnrolledCourse[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select(`id, enrolled_at, progress_percent, courses (${courseSelect})`)
    .eq("student_id", studentId)
    .order("enrolled_at", { ascending: false });

  if (error) throw new Error(error.message);
  const rows = (data as EnrolledRow[] | null) ?? [];

  return rows
    .map((r) => {
      const course = pickCourse(r.courses);
      if (!course) return null;
      return {
        ...mapCourseRow(course),
        enrollmentId: String(r.id),
        progressPercent: r.progress_percent,
        enrolledAt: r.enrolled_at
      };
    })
    .filter((c): c is EnrolledCourse => c !== null);
}

export type AdminCourseRow = {
  numericId: number;
  slug: string;
  title: string;
  category: string;
  level: string;
  status: string;
  price: number;
  duration: string | null;
  shortDescription: string;
  description: string;
  instructorId: number | null;
};

export async function getAllCoursesForAdmin(): Promise<AdminCourseRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, category, level, status, price, duration, short_description, description, instructor_id")
    .order("id");

  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    numericId: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    level: r.level,
    status: r.status,
    price: r.price,
    duration: r.duration,
    shortDescription: r.short_description ?? "",
    description: r.description,
    instructorId: r.instructor_id
  }));
}

export async function getCourseByIdForAdmin(id: number): Promise<AdminCourseRow | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, category, level, status, price, duration, short_description, description, instructor_id")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    numericId: data.id,
    slug: data.slug,
    title: data.title,
    category: data.category,
    level: data.level,
    status: data.status,
    price: data.price,
    duration: data.duration,
    shortDescription: data.short_description ?? "",
    description: data.description,
    instructorId: data.instructor_id
  };
}

export type AdminInstructorRow = {
  id: number;
  slug: string;
  fullName: string;
  email: string;
  specialty: string;
  status: string;
  shortBio: string;
  bio: string;
};

export async function getAllInstructorsForAdmin(): Promise<AdminInstructorRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("instructors")
    .select("id, slug, full_name, email, specialty, status, short_bio, bio")
    .order("full_name");

  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    fullName: r.full_name,
    email: r.email,
    specialty: r.specialty,
    status: r.status,
    shortBio: r.short_bio ?? "",
    bio: r.bio ?? ""
  }));
}

export async function getInstructorByIdForAdmin(id: number): Promise<AdminInstructorRow | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("instructors")
    .select("id, slug, full_name, email, specialty, status, short_bio, bio")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: data.id,
    slug: data.slug,
    fullName: data.full_name,
    email: data.email,
    specialty: data.specialty,
    status: data.status,
    shortBio: data.short_bio ?? "",
    bio: data.bio ?? ""
  };
}

export async function getCourseReviews(courseId: number): Promise<CourseReview[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, student_public_profiles(full_name)")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    student_public_profiles: { full_name: string } | { full_name: string }[] | null;
  }[]).map((r) => {
    const student = Array.isArray(r.student_public_profiles) ? r.student_public_profiles[0] : r.student_public_profiles;
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      studentName: student?.full_name ?? "Anonymous"
    };
  });
}

export async function getCourseRatingSummary(courseId: number): Promise<{ average: number; count: number }> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("course_id", courseId);

  if (error) throw new Error(error.message);
  const rows = data ?? [];
  if (rows.length === 0) return { average: 0, count: 0 };

  const sum = rows.reduce((acc, r) => acc + r.rating, 0);
  return { average: Math.round((sum / rows.length) * 10) / 10, count: rows.length };
}

export async function getMyReviewForCourse(studentId: number, courseId: number) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment")
    .eq("student_id", studentId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}