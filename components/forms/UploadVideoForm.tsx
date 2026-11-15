"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { FileVideo, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB, must match PART_SIZE in app/api/protected/upload/route.ts
const MIN_TITLE_LENGTH = 5;

type UploadPart = { partNumber: number; signedUrl: string };

export default function UploadVideoForm({ maxFileSizeBytes }: { maxFileSizeBytes: number }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const maxSizeLabel = maxFileSizeBytes > 0 ? formatBytes(maxFileSizeBytes) : null;

    const chooseFile = (candidate: File | null | undefined) => {
        if (!candidate) return;
        // Some browsers leave the type empty for containers like .mkv, so only reject known non-videos.
        if (candidate.type && !candidate.type.startsWith("video/")) {
            toast.error("That file isn't a video. Choose a video file.");
            return;
        }
        if (maxFileSizeBytes > 0 && candidate.size > maxFileSizeBytes) {
            toast.error(`That file is ${formatBytes(candidate.size)}. The limit is ${maxSizeLabel}.`);
            return;
        }
        setFile(candidate);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => chooseFile(e.target.files?.[0]);

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        chooseFile(e.dataTransfer.files?.[0]);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (title.trim().length < MIN_TITLE_LENGTH) {
            toast.error(`Give the video a title of at least ${MIN_TITLE_LENGTH} characters.`);
            return;
        }
        if (!file) {
            toast.error("Choose a video file to upload.");
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const response = await fetch("/api/protected/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, size: file.size, contentType: file.type }),
            });

            if (!response.ok) {
                const { error } = await response.json().catch(() => ({ error: undefined }));
                throw new Error(error || "The upload couldn't be started.");
            }

            const { id, key, uploadId, parts } = await response.json();
            const uploadedParts = await uploadParts(parts, file);

            const completeResponse = await fetch("/api/protected/upload/complete-multipart-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uploadId, key, id, parts: uploadedParts }),
            });

            if (!completeResponse.ok) {
                const { error } = await completeResponse.json().catch(() => ({ error: undefined }));
                throw new Error(error || "The upload couldn't be finished.");
            }

            toast.success("Upload complete");
            router.push(`/edit/${id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "The upload failed. Try again.");
            setIsUploading(false);
            setProgress(0);
        }
    };

    const uploadParts = async (parts: UploadPart[], source: File) => {
        const uploadedParts = [];

        for (const { partNumber, signedUrl } of parts) {
            const start = (partNumber - 1) * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, source.size);

            const response = await fetch(signedUrl, { method: "PUT", body: source.slice(start, end) });
            if (!response.ok) {
                throw new Error(`Part ${partNumber} of the upload failed. Try again.`);
            }

            uploadedParts.push({ PartNumber: partNumber, ETag: response.headers.get("ETag") });
            setProgress(Math.round((end / source.size) * 100));
        }

        return uploadedParts;
    };

    if (isUploading && file) {
        return (
            <div className="rounded-lg border border-rail bg-stage/60 p-5" role="status" aria-live="polite">
                <div className="flex items-start gap-3">
                    <FileVideo aria-hidden className="mt-0.5 size-5 shrink-0 text-usher" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{title}</p>
                        <p className="truncate text-sm text-usher">
                            {file.name}, {formatBytes(file.size)}
                        </p>
                    </div>
                    <p className="text-sm font-medium tabular-nums">{progress}%</p>
                </div>
                <div
                    className="mt-4 h-1.5 overflow-hidden rounded-full bg-stage-raised"
                    role="progressbar"
                    aria-label="Upload progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                >
                    <div className="h-full rounded-full bg-signal transition-[width] duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 text-[13px] text-usher">
                    {progress === 100 ? "Finishing up…" : "Keep this tab open until the upload finishes."}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Title" htmlFor="title">
                <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    minLength={MIN_TITLE_LENGTH}
                    required
                />
            </Field>

            <div className="space-y-2">
                <span id="file-label" className="block text-sm font-medium text-screen">
                    Video file
                </span>
                <label
                    htmlFor="file"
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                        "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-rail bg-stage/60 px-6 py-10 text-center transition-colors hover:border-usher/60 has-[:focus-visible]:border-signal",
                        isDragging && "border-signal bg-signal/5"
                    )}
                >
                    {file ? (
                        <>
                            <FileVideo aria-hidden className="size-6 text-screen" />
                            <span className="max-w-full truncate font-medium">{file.name}</span>
                            <span className="text-sm text-usher">
                                {formatBytes(file.size)}. Click to choose a different file.
                            </span>
                        </>
                    ) : (
                        <>
                            <Upload aria-hidden className="size-6 text-usher" />
                            <span className="font-medium">Choose a video file</span>
                            <span className="text-sm text-usher">
                                or drag it here{maxSizeLabel ? `. Up to ${maxSizeLabel}.` : "."}
                            </span>
                        </>
                    )}
                    <input
                        id="file"
                        type="file"
                        accept="video/*"
                        aria-labelledby="file-label"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                </label>
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto">
                <Upload aria-hidden />
                Upload video
            </Button>
        </form>
    );
}
