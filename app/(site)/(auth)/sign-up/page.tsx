import SignUpForm from "@/components/forms/SignUpForm";
import { validateRequest } from "@/lib/auth";
import { safeReturnPath, withReturnPath } from "@/lib/return-path";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Create account",
    description: "Create a Subatic account",
};

export default async function SignUpPage(props: { searchParams: Promise<{ next?: string | string[] }> }) {
    const next = safeReturnPath((await props.searchParams).next);
    const { user } = await validateRequest();
    if (user) {
        return redirect(next);
    }

    return (
        <>
            <h1 className="text-4xl font-semibold font-stretch-condensed tracking-tight">Create an account</h1>
            <p className="mt-2 text-usher">You&apos;ll be able to upload videos and share them anywhere.</p>
            <div className="mt-8">
                <SignUpForm next={next} />
            </div>
            <p className="mt-8 border-t border-rail pt-6 text-sm text-usher">
                Already have an account?{" "}
                <Link href={withReturnPath("/sign-in", next)} className="font-medium text-screen underline decoration-signal underline-offset-4 hover:decoration-2">
                    Sign in
                </Link>
            </p>
        </>
    );
}
