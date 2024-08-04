import Link from "next/link";

interface Video {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
}

const VideoCard: React.FC<{ video: Video; publicUrl: string }> = ({ video, publicUrl }) => {
    const baseUrl = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`;

    return (
        <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2 truncate">{video.title}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                <div className="flex space-x-4 mb-4">
                    <img
                        alt="Short preview"
                        src={`${baseUrl}${video.id}/short.gif`}
                        className="w-24 h-24 object-cover rounded"
                    />
                    <img
                        alt="Long preview"
                        src={`${baseUrl}${video.id}/long.gif`}
                        className="w-24 h-24 object-cover rounded"
                    />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                        <span className="mr-1">🕒</span>
                        {video.createdAt.toLocaleDateString()}
                    </div>

                    <Link href={`/video/${video.id}`} className="text-blue-500 hover:text-blue-700 transition-colors flex items-center">
                        <span className="mr-1">▶️</span>
                        Watch
                    </Link>

                    <Link href={`/edit/${video.id}`} className="text-blue-500 hover:text-blue-700 transition-colors flex items-center">
                        <span className="mr-1">✏️</span>
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;