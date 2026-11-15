import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { DefaultAudioLayout, defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";

export interface VideoPlayerProps {
    title: string;
    stream: string;
    poster: string;
    thumbnailTrack?: string;
    className?: string;
}

export default function VideoPlayer({ title, stream, poster, thumbnailTrack, className }: VideoPlayerProps) {
    return (
        <MediaPlayer
            autoPlay
            className={["player", className].filter(Boolean).join(" ")}
            title={title}
            src={stream}
            load="eager"
            aspectRatio="16 / 9"
        >
            <MediaProvider>
                <Poster className="vds-poster" src={poster} alt="" />
            </MediaProvider>
            <DefaultAudioLayout icons={defaultLayoutIcons} />
            <DefaultVideoLayout icons={defaultLayoutIcons} thumbnails={thumbnailTrack} />
        </MediaPlayer>
    );
}
