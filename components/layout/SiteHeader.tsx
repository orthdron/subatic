import SearchBox from "@/components/forms/SearchBox";
import NavLink from "@/components/layout/NavLink";
import { buttonVariants } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import { LogOut, Upload } from "lucide-react";
import Link from "next/link";

export default async function SiteHeader() {
    const { user } = await validateRequest();

    return (
        <header className="sticky top-0 z-40 border-b border-rail bg-auditorium/90 backdrop-blur-md">
            <a
                href="#content"
                className="sr-only rounded-md bg-screen px-3 py-2 text-sm font-medium text-auditorium focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
            >
                Skip to content
            </a>
            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 md:h-16 md:grid-cols-[1fr_minmax(0,36rem)_1fr] md:py-0 lg:px-8">
                <Link href="/" className="justify-self-start rounded-sm" aria-label="Subatic home">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.svg" alt="" width={122} height={28} className="h-7 w-auto" />
                </Link>

                <nav aria-label="Account" className="flex items-center gap-1 justify-self-end md:order-3">
                    {user ? (
                        <>
                            <NavLink href="/videos">My videos</NavLink>
                            <Link href="/upload" className={buttonVariants({ size: "sm", className: "ml-1" })}>
                                <Upload aria-hidden />
                                Upload
                            </Link>
                            <Link
                                href="/sign-out"
                                prefetch={false}
                                aria-label="Sign out"
                                title="Sign out"
                                className={buttonVariants({ variant: "ghost", size: "icon-sm", className: "ml-1 text-usher" })}
                            >
                                <LogOut aria-hidden />
                            </Link>
                        </>
                    ) : (
                        <>
                            <NavLink href="/sign-in">Sign in</NavLink>
                            <Link href="/sign-up" className={buttonVariants({ size: "sm", className: "ml-1" })}>
                                Create account
                            </Link>
                        </>
                    )}
                </nav>

                <div className="col-span-2 md:order-2 md:col-span-1">
                    <SearchBox />
                </div>
            </div>
        </header>
    );
}
