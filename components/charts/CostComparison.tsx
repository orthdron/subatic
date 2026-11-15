"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type CostRow = {
    name: string;
    cost: number;
    /** The option Subatic uses, drawn in the brand red. */
    chosen?: boolean;
};

const COLORS = {
    chosen: "#f4434a",
    other: "#4a4652",
    label: "#f3f1f6",
    tick: "#a19dab",
};

function CostComparisonChart({
    title,
    data,
    format,
    notes,
}: {
    title: string;
    data: CostRow[];
    format: (cost: number) => string;
    notes: React.ReactNode;
}) {
    return (
        <figure className="my-10">
            <figcaption className="mb-1 text-lg font-semibold font-stretch-condensed tracking-tight text-screen">
                {title}
            </figcaption>
            <p className="mb-4 text-sm text-usher">Red marks the option Subatic uses.</p>
            <div className="rounded-lg border border-rail bg-stage/50 px-2 py-4 sm:px-4">
                <ResponsiveContainer width="100%" height={data.length * 52 + 16}>
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }} barCategoryGap={10}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={128}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: COLORS.tick, fontSize: 13 }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.04)" }}
                            formatter={(value) => [format(Number(value)), "Cost"]}
                            contentStyle={{ background: "#25232b", border: "1px solid #2e2b35", borderRadius: 6, fontSize: 13 }}
                            labelStyle={{ color: COLORS.label }}
                            itemStyle={{ color: COLORS.label }}
                        />
                        <Bar dataKey="cost" radius={[0, 3, 3, 0]} minPointSize={2} isAnimationActive={false}>
                            {data.map((row) => (
                                <Cell key={row.name} fill={row.chosen ? COLORS.chosen : COLORS.other} />
                            ))}
                            <LabelList
                                dataKey="cost"
                                position="right"
                                formatter={(value) => format(Number(value))}
                                style={{ fill: COLORS.label, fontSize: 13, fontVariantNumeric: "tabular-nums" }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-usher">{notes}</div>
        </figure>
    );
}

export function StorageCostChart() {
    return (
        <CostComparisonChart
            title="Storage cost for 1 TB per month"
            format={(cost) => `$${cost}`}
            data={[
                { name: "AWS S3", cost: 23 },
                { name: "Bunny.net", cost: 10 },
                { name: "Backblaze B2", cost: 6 },
                { name: "Cloudflare R2", cost: 15, chosen: true },
            ]}
            notes={
                <>
                    <p>Pricing as of August 2024:</p>
                    <ul className="list-disc pl-5">
                        <li>AWS S3: $0.023 per GB</li>
                        <li>Bunny.net: $0.01 per GB</li>
                        <li>Backblaze B2: $0.006 per GB</li>
                        <li>Cloudflare R2: $0.015 per GB</li>
                    </ul>
                </>
            }
        />
    );
}

export function TranscodingCostChart() {
    return (
        <CostComparisonChart
            title="Transcoding cost for 5 minutes of video"
            format={(cost) => `$${cost.toFixed(2)}`}
            data={[
                { name: "AWS MediaConvert", cost: 7.65 },
                { name: "Bunny", cost: 0 },
                { name: "Coconut.co", cost: 4.05 },
                { name: "DIY (Hetzner)", cost: 0.07, chosen: true },
            ]}
            notes={
                <>
                    <ul className="list-disc pl-5">
                        <li>AWS MediaConvert: $7.65 for 4K, 1080p, 720p and 480p combined</li>
                        <li>Bunny: free transcoding</li>
                        <li>Coconut.co: $4.05 for 4K, 1080p, 720p and 480p combined</li>
                        <li>DIY (Hetzner): $0.15 estimated cost for server time</li>
                    </ul>
                    <p>Prices are for transcoding 5 minutes of video to 4K, 1080p, 720p and 480p.</p>
                </>
            }
        />
    );
}

export function StreamingCostChart() {
    return (
        <CostComparisonChart
            title="Streaming cost for 1 TB (6,000 streams at 5 Mbps)"
            format={(cost) => `$${cost.toFixed(2)}`}
            data={[
                { name: "AWS", cost: 85 },
                { name: "Bunny (Standard)", cost: 30 },
                { name: "Bunny (Volume)", cost: 5 },
                { name: "Cloudflare (3s)", cost: 0.216, chosen: true },
            ]}
            notes={
                <>
                    <ul className="list-disc pl-5">
                        <li>AWS CloudFront: $0.085 per GB for the first 10 TB a month</li>
                        <li>Bunny CDN Standard: $30 per TB</li>
                        <li>Bunny CDN Volume: $5 per TB</li>
                        <li>Cloudflare R2: free egress, $0.36 per million Class B operations</li>
                        <li>6,000 streams of 5 minutes in 3-second segments is 600,000 segments</li>
                    </ul>
                    <p>
                        Cloudflare&apos;s cost depends on segment length, because every segment is a separate request.
                    </p>
                </>
            }
        />
    );
}
