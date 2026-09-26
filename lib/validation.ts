import { z } from "zod";

export const signUpSchema = z.object({
    first_name: z.string().trim().min(1, "First name is required."),
    last_name: z.string().trim().min(1, "Last name is required."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    country: z.string().trim().min(1, "Country is required."),
    skill_level: z.enum(["beginner", "intermediate", "advanced"], {
        message: "Please select a skill level."
    })
});

export const signInSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required.")
});

export const courseSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    category: z.string().trim().min(1, "Category is required."),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    status: z.enum(["draft", "published"]),
    price: z.coerce.number().min(0, "Price cannot be negative."),
    duration: z.string().trim().optional().nullable(),
    short_description: z.string().trim().optional().nullable(),
    description: z.string().trim().min(10, "Description must be at least 10 characters."),
    instructor_id: z.coerce.number().nullable().optional()
});

export const instructorSchema = z.object({
    full_name: z.string().trim().min(2, "Full name must be at least 2 characters."),
    email: z.string().trim().email("Please enter a valid email address."),
    specialty: z.string().trim().min(1, "Specialty is required."),
    status: z.enum(["active", "inactive"]),
    short_bio: z.string().trim().optional().nullable(),
    bio: z.string().trim().optional().nullable()
});

export function firstIssueMessage(error: z.ZodError): string {
    return error.issues[0]?.message ?? "Invalid input.";
}

export const reviewSchema = z.object({
    rating: z.coerce.number().int().min(1, "Rating is required.").max(5),
    comment: z.string().trim().max(1000).optional().nullable()
});