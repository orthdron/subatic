
import VideoPlayer from "@/components/videoPlayer";
import { db } from "@/database/db";
import { redirect } from "next/navigation";
// import Recommendations from "./recommendations";
// import UserDetails from "./userDetails";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;

    const video = await db.selectFrom('video')
        .selectAll()
        .where('id', '=', id)
        .limit(1)
        .executeTakeFirst();

    if (!video) {
        redirect('/');
    }

    const publicUrl = process.env.NEXT_PUBLIC_FILE_URL;

    if (!publicUrl) {
        throw new Error("NEXT_PUBLIC_FILE_URL is not defined");
    }
    const videoProps = {
        url: `${publicUrl}${id}/master.m3u8`,
        vtt: `${publicUrl}${id}/sprite.vtt`,
        ...video
    };

    return (
        <div className="md:flex">
            <div className="mx-5 md:basis-9/12">
                <VideoPlayer props={videoProps} />
                {/* <UserDetails props={{ id }} /> */}
            </div>
            <div className="mx-5 md:basis-3/12">
                {/* <Recommendations /> */}
            </div>
        </div>
    );
}