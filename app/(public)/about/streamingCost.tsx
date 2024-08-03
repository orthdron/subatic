"use client";
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    { name: 'AWS', cost: 85, color: '#FF9900' },
    { name: 'Bunny (S)', cost: 30, color: '#FF6600' },
    { name: 'Bunny (V)', cost: 5, color: '#FF6600' },
    { name: 'Cf (3s)', cost: 0.216, color: '#F38020' },
];

const StreamingCostComparison = () => (
    <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Streaming Cost Comparison (1TB / 6000 streams at 5mbps)</h2>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#8884d8">
                    <LabelList dataKey="cost" position="top" formatter={(value: number) => `$${value.toFixed(2)}`} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
            <p>Pricing details:</p>
            <ul className="list-disc pl-5">
                <li>AWS CloudFront: $0.085 per GB for the first 10 TB/month</li>
                <li>Bunny CDN Standard: $30 per TB</li>
                <li>Bunny CDN Volume: $5 per TB</li>
                <li>Cloudflare R2: Free egress, $0.36 per million Class B operations.</li>
                <li>Total segments for 6000 streams of 5 minutes = 6,00,000</li>
            </ul>
            <p className="mt-2">Note: Prices are for streaming 1TB of data across 6000 streams. Cloudflare costs vary based on segment length due to the number of requests.</p>
        </div>
    </div>
);

export default StreamingCostComparison;