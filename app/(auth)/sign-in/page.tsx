import { validateRequest } from "@/lib/auth";
import login from "@/utils/auth/login";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const { user } = await validateRequest();
    if (user) {
        return redirect("/");
    }

    return (<div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    className="w-auto h-10 mx-auto"
                    src="/logo.webp"
                    width={100}
                    height={100}
                    alt="Subatic"
                />
                <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-white">
                    Sign in to an account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action={login}>
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-white"
                        >
                            Username or Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete=""
                                required
                                placeholder="Username"
                                className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-white"
                            >
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Enter password"
                                className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit"> Sign In </button>
                    </div>
                </form>
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
