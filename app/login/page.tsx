"use client"

import { signInAction, type AuthActionState } from "@/actions/auth";
import { SectionTitle } from "@/components/SectionTitle";
import { useActionState } from "react";

const initial: AuthActionState = undefined;

export default function Login() {

    const [state, formAction, pending] = useActionState(signInAction, initial);

    return (
        <section className="pad-section">
            <div className="container">
                <div className="stack">
                    <SectionTitle
                        eyebrow="Students"
                        title="Login"
                        description="Use your email and password for login.">
                    </SectionTitle>

                    <form action={formAction} className="stack-md panel">

                        <div className="field">
                            <input className="input" type="email" name="email" placeholder="Email" />
                        </div>

                        <div className="field">
                            <input className="input" type="password" name="password" placeholder="Password" />
                        </div>

                        {state?.error ? <p>{state.error}</p> : null}

                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </section>
    )
}