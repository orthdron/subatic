"use client"
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    { name: 'AWS S3', cost: 23, color: '#FF9900' },
    { name: 'Bunny.net', cost: 10, color: '#FF6600' },
    { name: 'Backblaze B2', cost: 6, color: '#E60000' },
    { name: 'Cloudflare R2', cost: 15, color: '#F38020' },
];

const StorageCostComparison = () => (
    <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Storage Cost Comparison (1TB/month)</h2>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#8884d8">
                    <LabelList dataKey="cost" position="top" formatter={(value: any) => `$${value}`} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
            <p>Pricing sources (as of August 2024):</p>
            <ul className="list-disc pl-5">
                <li>AWS S3: $0.023 per GB</li>
                <li>Bunny.net: $0.01 per GB</li>
                <li>Backblaze B2: $0.006 per GB</li>
                <li>Cloudflare R2: $0.015 per GB</li>
            </ul>
        </div>
    </div>
);

export default StorageCostComparison;