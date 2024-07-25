import VideoThumbnail from "@/components/videoThumbnail";
import { db } from "@/database/db";

export default async function Home() {
  const videos = await db.selectFrom("video")
    .where('status', '=', 'DONE')
    .selectAll().execute();

  return (
    <div className="p-4">
      {videos.length === 0 ? (
        <p className="text-center text-4xl">No videos found 😢</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {videos.map((video) => (
            <VideoThumbnail key={video.id || video.title} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
