import { Metadata } from "next";

const IconVideo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);

const IconGlobe = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const IconBook = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

export const metadata: Metadata = {
    title: 'Subatic - About',
    description:
        'About this project',
};

export default function Page() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-200">
            <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Discover Subatic
            </h1>

            <div className="space-y-8">
                <div className="flex items-start space-x-4">
                    <IconVideo />
                    <div>
                        <h2 className="text-2xl font-semibold mb-2 text-blue-300">Hassle-Free Video Hosting</h2>
                        <p className="text-lg">
                            Subatic empowers you to host and share your videos without the headache of managing servers or worrying about bandwidth costs. Focus on your content, let us handle the rest.
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <IconGlobe />
                    <div>
                        <h2 className="text-2xl font-semibold mb-2 text-green-300">Open Source Freedom</h2>
                        <p className="text-lg">
                            We believe in transparency and community-driven development. Subatic is proudly open source, allowing you to explore, contribute, and customize to your heart's content.
                        </p>
                        <a
                            href="https://github.com/orthdron/subatic"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            Dive into our GitHub repository →
                        </a>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <IconBook />
                    <div>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-300">Our Journey</h2>
                        <p className="text-lg">
                            Every project has a story, and Subatic's tale is one of innovation, challenges, and triumphs. We've poured our passion into creating a platform that revolutionizes video sharing.
                        </p>
                        <a
                            href="https://subatic.com/story"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                            Read our inspiring story →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}