/** Shape used by catalog cards and lists (mapped from Supabase). */
export type CatalogCourse = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  duration: string | null;
  instructorName: string;
  instructorSlug: string | null;
};

export type InstructorPublic = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  shortBio: string;
  bio: string;
};

export type CourseDetail = CatalogCourse & {
  numericId: number;
  instructor:
    | (Pick<InstructorPublic, "slug" | "name" | "specialty" | "shortBio" | "bio"> & {
        id: string;
      })
    | null;
};

export type EnrolledCourse = CatalogCourse & {
  enrollmentId: string;
  progressPercent: number;
  enrolledAt: string;
};

export type CourseReview = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  studentName: string;
};