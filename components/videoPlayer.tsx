// "use client";

import {
    MediaPlayer,
    MediaProvider,
    Poster
} from '@vidstack/react';
import {
    DefaultAudioLayout,
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

interface VideoPlayerProps {
    url: string;
    title: string;
    vtt?: string;
    poster?: string;
    other?: string;
}
export default function VideoPlayer({ props }: { props: VideoPlayerProps }) {
    const { url, poster, vtt, title } = props;
    return (
        <MediaPlayer
            autoPlay
            className="p-0 m-0"
            title={title}
            src={url}
            load="eager"
            aspectRatio="16 / 9"
        >
            <MediaProvider>
                <Poster
                    className="vds-poster"
                    src={poster}
                    alt={url}
                />
            </MediaProvider>
            <DefaultAudioLayout icons={defaultLayoutIcons} />
            <DefaultVideoLayout icons={defaultLayoutIcons}
                thumbnails={vtt}
            />
        </MediaPlayer>
    );
}