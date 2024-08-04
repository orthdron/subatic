import SignUpForm from "@/components/forms/SignUpForm";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Subatic - Sign Up',
    description:
        'Sign up for a subatic account',
};

export default async function Page() {
    const { user } = await validateRequest();
    if (user) {
        return redirect("/");
    }
    return (<div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-white">
                    Sign up for an account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <SignUpForm />
            </div>
        </div>
        <p className="px-8 text-xl text-center text-muted-foreground">
            Already a User? <br />
            <Link
                href="/sign-in"
                className="underline hover:text-brand underline-offset-4"
            >
                Sign in
            </Link>
        </p>
    </div>
    );
}
