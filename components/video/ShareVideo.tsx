"use client";

import { Button } from "@/components/ui/button";
import { fieldControlClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

function CopyField({ id, label, value, multiline }: { id: string; label: string; value: string; multiline?: boolean }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success(`${label} copied`);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error(`Couldn't copy. Select the text and copy it manually.`);
        }
    };

    const controlClass = cn(
        fieldControlClass,
        "font-mono text-[13px] text-usher sm:text-[13px] focus-visible:text-screen"
    );

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <label htmlFor={id} className="text-sm font-medium text-screen">
                    {label}
                </label>
                <Button type="button" variant="ghost" size="sm" onClick={copy} className="-mr-2 h-8">
                    {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                    {copied ? "Copied" : "Copy"}
                    <span className="sr-only"> {label.toLowerCase()}</span>
                </Button>
            </div>
            {multiline ? (
                <textarea
                    id={id}
                    readOnly
                    value={value}
                    rows={5}
                    onFocus={(e) => e.currentTarget.select()}
                    className={cn(controlClass, "resize-none py-2 leading-relaxed")}
                />
            ) : (
                <input
                    id={id}
                    readOnly
                    value={value}
                    onFocus={(e) => e.currentTarget.select()}
                    className={cn(controlClass, "h-10")}
                />
            )}
        </div>
    );
}

export default function ShareVideo({ pageUrl, embedCode }: { pageUrl: string; embedCode: string }) {
    return (
        <section aria-labelledby="share-heading" className="space-y-5 rounded-lg border border-rail bg-stage/60 p-5">
            <h2 id="share-heading" className="text-xl font-semibold font-stretch-condensed tracking-tight">
                Share
            </h2>
            <CopyField id="share-link" label="Link" value={pageUrl} />
            <CopyField id="share-embed" label="Embed code" value={embedCode} multiline />
        </section>
    );
}
