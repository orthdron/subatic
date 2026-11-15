import PageContainer from "@/components/layout/PageContainer";
import { BookOpen, Code, Video } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About",
    description: "About this project",
};

const linkClass =
    "mt-3 inline-block font-medium text-screen underline decoration-signal underline-offset-4 hover:decoration-2";

export default function AboutPage() {
    return (
        <PageContainer width="narrow" className="max-w-2xl pt-12">
            <h1 className="text-5xl font-semibold leading-[1.02] font-stretch-condensed tracking-tight">
                About Subatic
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-usher">
                A simple video sharing platform you host yourself, built to keep streaming costs close to zero.
            </p>

            <div className="mt-12 space-y-10">
                <section className="flex gap-4">
                    <Video aria-hidden className="mt-1 size-6 shrink-0 text-signal" />
                    <div>
                        <h2 className="text-2xl font-semibold font-stretch-condensed tracking-tight">
                            Hassle-free video hosting
                        </h2>
                        <p className="mt-2 leading-relaxed text-screen/85">
                            Subatic lets you host and share your videos without the headache of managing servers or
                            worrying about bandwidth costs. Focus on your content, let us handle the rest.
                        </p>
                    </div>
                </section>

                <section className="flex gap-4">
                    <Code aria-hidden className="mt-1 size-6 shrink-0 text-signal" />
                    <div>
                        <h2 className="text-2xl font-semibold font-stretch-condensed tracking-tight">Open source</h2>
                        <p className="mt-2 leading-relaxed text-screen/85">
                            We believe in transparency and community-driven development. Subatic is open source, so
                            you can explore, contribute, and customize it to your heart&apos;s content.
                        </p>
                        <a
                            href="https://github.com/orthdron/subatic"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                        >
                            Browse the source on GitHub
                        </a>
                    </div>
                </section>

                <section className="flex gap-4">
                    <BookOpen aria-hidden className="mt-1 size-6 shrink-0 text-signal" />
                    <div>
                        <h2 className="text-2xl font-semibold font-stretch-condensed tracking-tight">Our journey</h2>
                        <p className="mt-2 leading-relaxed text-screen/85">
                            Every project has a story, and Subatic&apos;s is one of innovation, challenges, and
                            triumphs. I&apos;ve poured my passion into creating a platform that rethinks video sharing.
                        </p>
                        <Link href="/story" className={linkClass}>
                            Read how Subatic cut streaming costs by 99%
                        </Link>
                    </div>
                </section>
            </div>
        </PageContainer>
    );
}
