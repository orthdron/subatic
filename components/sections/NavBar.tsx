import { validateRequest } from "@/lib/auth";
import Link from 'next/link';
import SearchBox from "../forms/SearchBox";

export default async function NavBar() {

    const { user } = await validateRequest();

    return (
        <div className="border-b-2 border-white flex flex-col md:flex-row items-center justify-between px-4">
            <div className="flex items-center">
                <Link href="/"><img className="h-14 p-2" src="/logo.svg" alt="Subatic" /></Link>
            </div>
            <div className="grow text-center my-4 md:my-0 w-11/12 lg:w-1/2">
                <SearchBox />
            </div>
            <div className="flex flex-row space-x-4 text-center py-4">
                {user ?
                    (
                        <>
                            <Link href="/videos">
                                My Videos
                            </Link>
                            <Link href="/upload">
                                Upload
                            </Link>
                            <Link href="/sign-out">
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-up">
                                Sign-Up
                            </Link>
                            <Link href="/sign-in">
                                Login
                            </Link>
                        </>
                    )
                }
            </div>
        </div>
    );
}
