"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

/** `next`: an already-validated path on this site to open afterwards (see safeReturnPath). */
export default function SignInForm({ next = "/" }: { next?: string }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const signIn = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData: { error?: string } = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Sign-in failed. Check your details and try again.");
            }

            // Full reload so the header picks up the new session.
            window.location.href = next;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Sign-in failed. Try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={signIn}>
            <Field label="Username or email" htmlFor="username">
                <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Field>
            <Field label="Password" htmlFor="password">
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Field>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
        </form>
    );
}
