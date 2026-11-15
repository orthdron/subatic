"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

// Mirrors the checks in app/api/auth/signup/route.ts
const USERNAME_PATTERN = "[a-z0-9_\\-]{3,31}";
const MIN_PASSWORD_LENGTH = 6;

/** `next`: an already-validated path on this site to open afterwards (see safeReturnPath). */
export default function SignUpForm({ next = "/" }: { next?: string }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const signUp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData: { error?: string } = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Couldn't create the account. Try again.");
            }

            // Full reload so the header picks up the new session.
            window.location.href = next;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Couldn't create the account. Try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={signUp}>
            <Field label="Email" htmlFor="email">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Field>
            <Field
                label="Username"
                htmlFor="username"
                hintId="username-hint"
                hint="3–31 characters: lowercase letters, numbers, hyphens and underscores."
            >
                <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    pattern={USERNAME_PATTERN}
                    aria-describedby="username-hint"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Field>
            <Field
                label="Password"
                htmlFor="password"
                hintId="password-hint"
                hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD_LENGTH}
                    aria-describedby="password-hint"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Field>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
        </form>
    );
}
