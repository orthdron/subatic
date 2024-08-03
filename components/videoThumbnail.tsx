"use client";
import Link from "next/link";
import { useState } from "react";

export default function VideoThumbnail({ video }: { video: { id: string, title: string } }) {
    const [isHovered, setIsHovered] = useState(false);

    let imgSrc, id, title;

    if (!video) {
        imgSrc = isHovered
            ? "https://picsum.photos/384/216?random=" + Math.random()
            : `https://videos.subatic.com/${id}/short.gif`;
        id = "abc";
        title = "sample";
    } else {
        id = video.id;
        imgSrc = isHovered
            ? `https://videos.subatic.com/${id}/long.gif`
            : `https://videos.subatic.com/${id}/short.gif`;
        title = video.title;
    }
    return (
        <div className="mb-5">
            <Link href={`/video/${id}`}>
                <figure>
                    <img
                        className="mx-auto rounded-lg"
                        src={imgSrc}
                        alt="video transcoding...."
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    />
                    <figcaption className="mt-2 text-center text-gray-500 text-md dark:text-gray-400">
                        {title}
                    </figcaption>
                </figure>
            </Link>
        </div>
    );
}
