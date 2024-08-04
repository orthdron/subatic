import { validateRequest } from "@/lib/auth";
import SearchBox from "../forms/SearchBox";

export default async function NavBar() {

    const { user } = await validateRequest();

    return (
        <div className="border-b-2 border-white flex flex-col md:flex-row items-center justify-between px-4">
            <div className="flex items-center">
                <a href="/"><img className="h-14 p-2" src="/logo.webp" alt="subatic logo" /></a>
            </div>
            <div className="flex-grow text-center my-4 md:my-0 w-11/12 lg:w-1/2">
                <SearchBox />
            </div>
            <div className="flex flex-row space-x-4 text-center py-4">
                {user ?
                    (
                        <>
                            <a href="/videos">
                                My Videos
                            </a>
                            <a href="/upload">
                                Upload
                            </a>
                            <a href="/sign-out">
                                Logout
                            </a>
                        </>
                    ) : (
                        <>
                            <a href="/sign-up">
                                Sign-Up
                            </a>
                            <a href="/sign-in">
                                Login
                            </a>
                        </>
                    )
                }
            </div>
        </div>
    );
}
