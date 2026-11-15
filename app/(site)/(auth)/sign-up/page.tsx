import SignUpForm from "@/components/forms/SignUpForm";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Create account",
    description: "Create a Subatic account",
};

export default async function SignUpPage() {
    const { user } = await validateRequest();
    if (user) {
        return redirect("/");
    }

    return (
        <>
            <h1 className="text-4xl font-semibold font-stretch-condensed tracking-tight">Create an account</h1>
            <p className="mt-2 text-usher">You&apos;ll be able to upload videos and share them anywhere.</p>
            <div className="mt-8">
                <SignUpForm />
            </div>
            <p className="mt-8 border-t border-rail pt-6 text-sm text-usher">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium text-screen underline decoration-signal underline-offset-4 hover:decoration-2">
                    Sign in
                </Link>
            </p>
        </>
    );
}
