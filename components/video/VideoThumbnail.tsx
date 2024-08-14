import VideoThumbnailHover from "./videoThumbnailHover";

export default function VideoThumbnail({ video }: { video: { id: string; title: string } }) {

    const { id, title } = video;
    const baseUrl = process.env.PROCESSED_VIDEO_URL!.replace(/\/+$/, '');


    return (
        <VideoThumbnailHover video={{ id, title, baseUrl }} />
    );
}