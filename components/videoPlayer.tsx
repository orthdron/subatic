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
    vtt?: string;
    poster?: string;
    other?: string;
}
export default function VideoPlayer({ props }: { props: VideoPlayerProps }) {
    const { url, poster, vtt } = props;
    return (
        <MediaPlayer
            autoplay
            className="p-0 m-0"
            title="Sprite Fight"
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