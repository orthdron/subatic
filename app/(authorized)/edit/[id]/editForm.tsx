"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function EditVideoForm({ video }: { video: { id: string, title: string, description: string } }) {

    const [id, _] = useState(video.id);
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (title.trim().length < 5) {
            console.log(title.trim().length);
            toast.error("Title needs to be at least 5 characters");
            return;
        }
        if (!description) {
            toast.error("Please add some description");
            return;
        }
        if (typeof id != "string") {
            toast.error("Something wrong with title");
            return;
        }
        try {
            const data = new FormData();
            data.set("id", id);
            data.set("title", title);
            data.set("description", description);
            const res = await fetch("/api/protected/edit", {
                method: "PATCH",
                body: data,
            });
            const response = await res.json();
            if (res.ok) {
                toast.success("Updates saved!");
            } else {
                toast.error(response.error);
            }
        } catch (e: any) {
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Video title
                    </label>
                    <Input
                        className="text-gray-950"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Description
                    </label>
                    <Textarea
                        className="text-gray-950"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <Button
                    className="items-center justify-center m-auto"
                    variant={"outline"}
                >
                    Update information
                </Button>
            </form>
            <Toaster />
        </>
    )
}