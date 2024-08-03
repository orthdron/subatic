import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignInForm from "./signInForm";

export default async function Page() {
    const { user } = await validateRequest();
    if (user) {
        return redirect("/");
    }

    return (<div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-white">
                    Sign in to an account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <SignInForm />
            </div>
        </div>
        <p className="px-8 text-xl text-center text-muted-foreground">
            Need an account? <br />
            <Link
                href="/sign-up"
                className="underline hover:text-brand underline-offset-4"
            >
                Sign up
            </Link>
        </p>
    </div>
    );
}
