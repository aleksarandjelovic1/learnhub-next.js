"use server"

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signUpSchema, signInSchema, firstIssueMessage } from "@/lib/validation";

export type AuthActionState = { error?: string } | undefined;

export async function signUpAction(
    _prev: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const parsed = signUpSchema.safeParse({
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password"),
        country: formData.get("country"),
        skill_level: formData.get("skill_level")
    });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const { first_name, last_name, email, password, country, skill_level } = parsed.data;

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: `${first_name} ${last_name}`,
                country: country,
                skill_level: skill_level
            }
        }
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/courses");
}

export async function signOutAction() {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function signInAction(
    _prev: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const parsed = signInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const { email, password } = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { error: error.message };
    }

    redirect("/courses");
}