"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

interface FormData {
    title: string;
    file: File | null;
    progress: number;
}

export default function CreateVideoForm() {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        file: null,
        progress: 0,
    });
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prevData) => ({ ...prevData, file }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.title.trim().length < 5) {
            toast.error("Title needs to be at least 5 characters");
            return;
        }
        if (!formData.file) {
            toast.error("Please select a file");
            return;
        }

        try {
            const response = await fetch("/api/protected/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    size: formData.file.size.toString(),
                    contentType: formData.file.type,
                }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "API call failed");
            }

            const { url: preSignedUrl, id } = await response.json();

            toast.loading("Uploading file");
            await uploadFile(preSignedUrl, formData.file);

            toast.dismiss();
            toast.success("Upload finished");
            router.push(`/edit/${id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    const uploadFile = (url: string, file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url, true);

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const progress = parseFloat(((event.loaded / event.total) * 100).toFixed(2));
                    setFormData((prevData) => ({ ...prevData, progress }));
                }
            });

            xhr.onload = () => xhr.status === 200 ? resolve() : reject(new Error("Upload failed"));
            xhr.onerror = () => reject(new Error("Network error"));

            xhr.send(file);
        });
    };

    if (formData.progress > 0) {
        return (
            <div className="w-full">
                <div className="flex justify-between m-1">
                    <span className="text-base font-medium text-blue-700 dark:text-white">Progress</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-white">{formData.progress}%</span>
                </div>
                <div className="w-full rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${formData.progress}%` }}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="mb-10 text-4xl">Create new video</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Video title
                    </label>
                    <Input
                        className="text-gray-950"
                        value={formData.title}
                        onChange={handleInputChange}
                        name="title"
                        placeholder="Video Title"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Video file
                    </label>
                    <Input
                        className="text-black bg-white"
                        type="file"
                        id="file"
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                </div>
                <Button className="m-auto" variant="outline">
                    Create Video
                </Button>
            </form>
            <Toaster />
        </>
    );
}