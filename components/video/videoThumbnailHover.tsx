"use client";
import Link from "next/link";
import { useState } from "react";

export default function VideoThumbnailHover({ video }: { video: { id: string; title: string, baseUrl: string } }) {
    const [isHovered, setIsHovered] = useState(false);

    const { id, title, baseUrl } = video;

    const imgSrc = `${baseUrl}/${id}/${isHovered ? 'long' : 'short'}.gif`;

    return (
        <div className="mb-5">
            <Link href={`/video/${id}`}>
                <figure
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        className="mx-auto rounded-lg"
                        src={imgSrc}
                        alt={`Thumbnail for ${title}`}
                    />
                    <figcaption className="mt-2 text-center text-gray-500 text-md dark:text-gray-400">
                        {title}
                    </figcaption>
                </figure>
            </Link>
        </div>
    );


}