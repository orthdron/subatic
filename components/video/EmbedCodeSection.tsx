'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

export default function EmbedCodeSection({ embedCode }: { embedCode: string }) {
    const copyEmbedCode = () => {
        navigator.clipboard.writeText(embedCode).then(() => {
            toast.success('Embed code copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy embed code');
        });
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-white">Embed this video</h3>
            <Textarea
                value={embedCode}
                readOnly
                className="w-full mb-2 bg-gray-700 text-white"
                rows={3}
            />
            <Button onClick={copyEmbedCode}>Copy Embed Code</Button>
        </div>
    );
}