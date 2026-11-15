import Link from "next/link";

const linkClass = "rounded-sm transition-colors hover:text-screen";

export default function SiteFooter() {
    return (
        <footer className="mt-16 border-t border-rail">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-8 text-sm text-usher sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>Subatic is open-source video hosting you can run yourself.</p>
                <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
                    <Link href="/about" className={linkClass}>
                        About
                    </Link>
                    <Link href="/story" className={linkClass}>
                        How it&apos;s built
                    </Link>
                    <a
                        href="https://github.com/orthdron/subatic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                    >
                        Source code
                    </a>
                    <a
                        href="https://www.linkedin.com/in/kapoor-deepak/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                    >
                        Contact
                    </a>
                </nav>
            </div>
        </footer>
    );
}
