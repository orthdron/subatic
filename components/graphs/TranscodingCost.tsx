"use client"
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    { name: 'AWS MediaConvert', cost: 7.65, color: '#FF9900' },
    { name: 'Bunny', cost: 0, color: '#FF6600' },
    { name: 'Coconut.co', cost: 4.05, color: '#00A86B' },
    { name: 'DIY (Hetzner)', cost: 0.07, color: '#D50000' },
];

const TranscodingCostComparison = () => (
    <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Transcoding Cost Comparison (60 minutes)</h2>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#8884d8">
                    <LabelList dataKey="cost" position="top" formatter={(value: any) => `$${value.toFixed(2)}`} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
            <p>Pricing details:</p>
            <ul className="list-disc pl-5">
                <li>AWS MediaConvert: $7.65 for 4K, 1080p, 720p, 480p combined</li>
                <li>Bunny: Free transcoding</li>
                <li>Coconut.co: $4.05 for 4K, 1080p, 720p, 480p combined</li>
                <li>DIY (Hetzner): $0.15 estimated cost for server time</li>
            </ul>
            <p className="mt-2">Note: Prices are for transcoding 5 minutes of video to 4k, 1080p, 720p, and 480p resolutions.</p>
        </div>
    </div>
);

export default TranscodingCostComparison;