"use client"

import { signUpAction, type AuthActionState } from "@/actions/auth";
import { SectionTitle } from "@/components/SectionTitle";
import { useActionState } from "react";

const initial: AuthActionState = undefined;

export default function Register() {

    const [state, formAction, pending] = useActionState(signUpAction, initial);

    return (
        <section className="pad-section">
            <div className="container">
                <div className="stack">
                    <SectionTitle
                        eyebrow="Students"
                        title="Create an account"
                        description="All fields are required.">
                    </SectionTitle>

                    <form action={formAction} className="stack-md panel">
                        <div className="field">
                            <input className="input" type="text" name="first_name" placeholder="First Name" />
                        </div>

                        <div className="field">
                            <input className="input" type="text" name="last_name" placeholder="Last Name" />
                        </div>

                        <div className="field">
                            <input className="input" type="email" name="email" placeholder="Email" />
                        </div>

                        <div className="field">
                            <input className="input" type="password" name="password" placeholder="Password" />
                        </div>

                        <div className="field">
                            <input className="input" type="text" name="country" placeholder="Country" />
                        </div>

                        <div className="field">
                            <select className="select" name="skill_level">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {state?.error ? <p className="form-error">{state.error}</p> : null}

                        <button type="submit" className="btn btn-primary" disabled={pending}>
                            {pending ? "Creating…" : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}