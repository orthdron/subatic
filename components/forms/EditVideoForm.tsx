"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

const MIN_TITLE_LENGTH = 5;

export default function EditVideoForm({
    video,
    isPublished,
}: {
    video: { id: string; title: string; description: string };
    isPublished: boolean;
}) {
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (title.trim().length < MIN_TITLE_LENGTH) {
            toast.error(`The title needs at least ${MIN_TITLE_LENGTH} characters.`);
            return;
        }

        setIsSaving(true);
        try {
            const data = new FormData();
            data.set("id", video.id);
            data.set("title", title);
            data.set("description", description);
            const res = await fetch("/api/protected/edit", { method: "PATCH", body: data });
            const response = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success("Changes saved");
            } else {
                toast.error(response.error || "Changes couldn't be saved. Try again.");
            }
        } catch {
            toast.error("Changes couldn't be saved. Check your connection and try again.");
        } finally {
            setIsSaving(false);
        }
    };

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
            <Field label="Description" htmlFor="description" hintId="description-hint" hint="Shown under the video. Line breaks are kept.">
                <Textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={description}
                    aria-describedby="description-hint"
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Field>
            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving…" : "Save changes"}
                </Button>
                {isPublished && (
                    <Link href={`/video/${video.id}`} className={buttonVariants({ variant: "outline" })}>
                        View video
                    </Link>
                )}
            </div>
        </form>
    );
}
