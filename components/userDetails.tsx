"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type VideoDetails = {
    userId: string;
    title: string;
};

type UserDetails = {
    userName: string;
};

export default function UserDetails({ props }: { props: { id: string } }) {

    // const userDetails =

    const { id } = props;
    const [videoDetails, setVideoDetails] = useState<VideoDetails>();

    const [userDetails, setUserDetails] = useState<UserDetails>();
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/video/${id}`);
                const data = await response.json();
                if (data && !data.error) {
                    setVideoDetails(data);
                } else {
                    router.push("/");
                }
            } catch (error) {
                router.push("/");
                console.error("Error fetching videos:", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (videoDetails) {
                try {
                    const response = await fetch(`/api/user/${videoDetails?.userId}`);
                    const data = await response.json();
                    if (data && !data.error) {
                        setUserDetails(data);
                    } else {
                        router.push("/");
                    }
                } catch (error) {
                    router.push("/");
                    console.error("Error fetching videos:", error);
                }
            }
        };
        fetchUserData();
    }, [videoDetails]);

    if (videoDetails && userDetails) {
        return (
            <>
                <div className="flex items-center mx-2 space-x-4">
                    <div className="w-12 h-12 rounded bg-slate-400 d-full animate-pulse" />
                    <div className="space-y-2">
                        <div>{videoDetails.title}</div>
                        <div>{userDetails.userName}</div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <div className="flex items-center mx-2 space-x-4">
                <div className="w-12 h-12 rounded-lg bg-slate-400 d-full animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 w-[250px] animate-pulse bg-slate-400" />
                    <div className="h-4 w-[150px] animate-pulse bg-slate-400" />
                </div>
            </div>
        );
    }
}