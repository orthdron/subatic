import SignInForm from "@/components/forms/SignInForm";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to your Subatic account",
};

export default async function SignInPage() {
    const { user } = await validateRequest();
    if (user) {
        return redirect("/");
    }

    return (
        <>
            <h1 className="text-4xl font-semibold font-stretch-condensed tracking-tight">Sign in</h1>
            <p className="mt-2 text-usher">Upload and manage your videos.</p>
            <div className="mt-8">
                <SignInForm />
            </div>
            <p className="mt-8 border-t border-rail pt-6 text-sm text-usher">
                No account yet?{" "}
                <Link href="/sign-up" className="font-medium text-screen underline decoration-signal underline-offset-4 hover:decoration-2">
                    Create one
                </Link>
            </p>
        </>
    );
}
