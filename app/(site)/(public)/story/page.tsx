import { StorageCostChart, StreamingCostChart, TranscodingCostChart } from "@/components/charts/CostComparison";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'The hunt for the cheapest way to host videos',
    description: 'Story of subatic',
};


export default async function Page() {
    return (
        <article className="mx-auto w-full max-w-[68ch] px-4 pt-12 text-[17px] leading-relaxed text-screen/90 [&_li]:mt-1.5 [&_strong]:font-semibold [&_strong]:text-screen">
            <h1 className="mb-10 text-4xl font-semibold leading-[1.05] font-stretch-condensed tracking-tight text-screen sm:text-5xl">🎥 Hunt to find the cheapest way to host videos</h1>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">📌 TL;DR Findings 🚀</h2>
                <ul className="list-disc pl-5">
                    <li>FFmpeg is <span className="line-through">hard</span> <strong>amazingly powerful</strong> 🎉</li>
                    <li>Cloud providers might be charging a fortune for peanuts (possibly) 🥜</li>
                    <li><span className="line-through">NSA</span> Cloudflare should seriously consider launching a video site 🌐</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🔍 How This Came to Be</h2>
                <p className="mb-4">A client approached me with a seemingly simple request &mdash; set up a video solution. Why, you may ask? They were using YouTube previously and were having difficulties:</p>
                <ul className="mb-4 list-disc pl-5">
                    <li>YouTube was putting ads and a clunky UI in their embeds 📺</li>
                    <li>The embeds were forcing users to bounce off from the blog and onto YouTube 🔄</li>
                    <li>Some of their videos were taken down due to copyright claims since they were using clips from other sources ⚖️</li>
                </ul>
                <p>The task was to move onto something else which doesn&apos;t interfere with these issues.</p>
            </section>

            <section className="mb-12">
                <h3 className="mb-3 mt-8 text-2xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">📝 The Requirements</h3>
                <ol className="list-decimal pl-5">
                    <li>YouTube-like quality and speed switching ⚡</li>
                    <li>Some kind of CDN so the videos load quickly 🚀</li>
                    <li>Universal device compatibility 📱💻</li>
                </ol>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🔍 The Initial Research Phase</h2>
                <p className="mb-4">I was new to this. I have built websites, hosted static pages, deployed microservices, but video hosting was something new. After some digging, I uncovered the magic formula:</p>
                <ul className="list-disc pl-5">
                    <li>Create an HLS stream (for quality switching) 🎞️</li>
                    <li>Store the HLS (obviously) 💾</li>
                    <li>Use a CDN (to serve the HLS) 🌐</li>
                    <li>Implement an embeddable video player (to embed the HLS) 📽️</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">💰 Let&apos;s Do the Math First</h2>
                <p className="mb-4"><em>My client uploads 5 videos a day, which are around 5 minutes each, and each get at least 10,000 views monthly.</em></p>
                <p className="mb-4">Using some ChatGPT calculation, a 5-minute video has these sizes:</p>
                <ul className="mb-4 list-disc pl-5">
                    <li>4K (2160p): 750 MB 📏</li>
                    <li>1080p: 300 MB 📏</li>
                    <li>720p: 187.5 MB 📏</li>
                    <li>480p: 93.75 MB 📏</li>
                </ul>
                <p className="mb-4">Let&apos;s ignore 4K for now, and round off the sum of others to 512MB (0.5GB)</p>
                <p className="mb-4"><strong>Storage needed for a single video: 0.5GB</strong> 📦</p>
                <p className="mb-4">Assuming that most of the streams are going to be in 1080p, total bandwidth for 10,000 views? 300MB * 10,000 / 1024 ≈ 2,929.69GB (Rounding off to 3TB)</p>
                <p className="mb-4"><strong>Bandwidth needed for a single video: 3TB</strong> 📊</p>
                <p className="mb-4">A 5-minute video has to be transcoded into 3 streams, 2 HD and 1 non-HD. Pricing is usually X for HD videos and 0.5X for non-HD videos.</p>
                <p className="mb-4"><strong>Transcoding required for a single video: 5 minutes (into 3 streams)</strong> ⏳</p>
                <p className="mb-4">So if my client wants to store 5 videos a day with each getting 10,000 views, they would need roughly:</p>
                <ul className="mb-4 list-disc pl-5">
                    <li>Transcoding: 5 * 110 = 9 hours and 10 minutes ⏰</li>
                    <li>Storage: 0.5GB * 5 * 22 = 55GB every month 📁</li>
                    <li>Bandwidth: 3TB * 5 * 22 = 330TB 📈</li>
                </ul>
                <p className="mb-4">For ease of calculation, let&apos;s round off:</p>
                <ul className="list-disc pl-5">
                    <li>Transcoding to 10 hours ⏱️</li>
                    <li>Storage to 50GB 📦</li>
                    <li>Bandwidth to 300TB 🌐</li>
                </ul>
            </section>

            <section className="mb-12">
                <h3 className="mb-3 mt-8 text-2xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🔧 So... How Do You Create HLS?</h3>
                <p>There are services that do this for you. AWS, Azure, GCP, etc., all have some sort of services that do this. Since the client was already using AWS for their websites, I decided to use AWS. Now I just need to put together a proposal and send out a quotation. Let&apos;s calculate.</p>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">💵 AWS Calculations 😎</h2>
                <p className="mb-4">At first glance, AWS seemed to have it all for me nicely packaged as a bundle:</p>
                <ul className="mb-4 list-disc pl-5">
                    <li>MediaConvert for transcoding 🎬</li>
                    <li>S3 for storage 📦</li>
                    <li>CloudFront for CDN ☁️</li>
                </ul>
                <p className="mb-4">Perfect! Let me quickly calculate the costs now.</p>
                <p className="mb-4">We have 10 hours of video to be transcoded every month.</p>
                <p className="mb-4"><strong>HLS conversion</strong>: $22.5 💲</p>
                <ul className="mb-4 ml-6 list-disc pl-5">
                    <li>1080p: $9 💵</li>
                    <li>720p: $9 💵</li>
                    <li>480p: $4.5 💵</li>
                </ul>
                <p className="mb-4"><strong>S3 storage (monthly)</strong>: $1.15 (50GB × $0.023 per GB) 💾</p>
                <p className="mb-4"><strong>CloudFront</strong>: $19,050 💸</p>
                <ul className="mb-4 ml-6 list-disc pl-5">
                    <li>First 10 TB: $870.40 (10,240 GB × $0.085 per GB) 💰</li>
                    <li>Next 40 TB: $3,276.80 (40,960 GB × $0.080 per GB) 💰</li>
                    <li>Next 100 TB: $6,144.00 (102,400 GB × $0.060 per GB) 💰</li>
                    <li>Next 150 TB: $6,144.00 (153,600 GB × $0.040 per GB) 💰</li>
                    <li>Remaining 30 TB: $900.00 (30,720 GB × $0.030 per GB) 💰</li>
                </ul>

                <p className="mb-4">Total bill? <strong>$19,000</strong> per month! 😱 (which might compound each month as the videos grow)</p>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">📞 The Client&apos;s Reality Check ☎️</h2>
                <blockquote className="mb-4 border-l-2 border-signal pl-5 text-lg italic text-screen">
                    &quot;This might not be worth it since YouTube has been kind of free this whole time. Is there a cheaper option?&quot; 🤔
                </blockquote>
                <p>I mean, I can&apos;t compete with YouTube&apos;s prices, but let&apos;s try.</p>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🕵️ The Quest for Alternatives</h2>
                <p className="mb-4">With the client&apos;s blessing to explore non-AWS options, I embarked on a new journey.</p>

                <h3 className="mb-3 mt-8 text-2xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🎬 Vimeo</h3>
                <p className="mb-4">Vimeo specializes in video hosting, so I thought they might have their pricing figured out better. Vimeo wants $9 a month for 100GB of storage but limits you to 2TB of bandwidth and has no clear indication of the pricing for more bandwidth. Reading through forums, I found out their pricing to be similarly high as AWS. <strong>SKIP</strong></p>

                <h3 className="mb-3 mt-8 text-2xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🐰 Bunny CDN</h3>
                <p className="mb-4">These guys have a Stream feature which does exactly what I want it to. Let&apos;s recalculate:</p>
                <ol className="mb-4 list-decimal pl-5">
                    <li><strong>HLS conversion</strong>: $0 (it&apos;s free!) 🎉</li>
                    <li><strong>Storage (monthly)</strong>: $0.5 (50 GB × $0.01 per GB) 💲</li>
                    <li><strong>Stream cost (volume tier) </strong>: $1500 (300 * 5$ per TB) 📊</li>
                </ol>
                <p className="mb-4">Total bill? <strong>$1500 monthly</strong> (Would compound each month) 💵</p>
                <p className="mb-4">We&apos;ve cut costs by 92%! 🎉</p>
                <p className="mb-4">I could have submitted the quote to the client and likely secured the project. However, I decided to delve deeper and explore other options. One key reason for avoiding a dedicated server was concurrency. Typically, a dedicated server has a port speed of 1Gbps and includes 20TB of bandwidth (Hetzner), allowing for 200 concurrent streams. Additionally, with extra bandwidth costing $1 per TB, we&apos;d be facing a $280 bandwidth cost without any CDN benefits. During traffic spikes, I didn&apos;t want to deal with a P0 call in the middle of the night without knowing how to resolve it. We needed a service that was (almost) hands-off.</p>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🛠️ DIY: The Final Frontier</h2>
                <p className="mb-4">Time to roll up our sleeves and do it ourselves!</p>

                <h3 className="mb-3 mt-8 text-2xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🔧 The DIY Breakdown</h3>
                <ol className="mb-4 list-decimal pl-5">
                    <li><strong>Transcoding</strong>: Python script + FFmpeg magic 🧙‍♂️
                        <ul className="ml-6 list-disc pl-5">
                            <li>Cost: $7 per month server with any cloud server (I like Hetzner). Can bump it up to $20-30 if I want faster transcodes. 💻</li>
                        </ul>
                    </li>
                    <li><strong>Storage</strong>: Cloudflare R2 at $15.0 / TB 💾
                        <ul className="ml-6 list-disc pl-5">
                            <li>(We passed on Backblaze at $6 / TB for reasons you&apos;ll see) 🚫</li>
                        </ul>
                    </li>
                    <li><strong>CDN</strong>: Cloudflare R2 with free egress! 🌟
                        <ul className="ml-6 list-disc pl-5">
                            <li>The catch: $0.36 / million class-B requests 💸</li>
                        </ul>
                    </li>
                </ol>
                <p className="mb-4">Cloudflare offers free egress? WAIT, WHAT. Let&apos;s calculate the cost of the &quot;catch&quot;.</p>
                <p className="mb-4">Since Cloudflare wants money for each file request, we need to open up the calculator and see how many requests would be made. A 5-minute video has 100 segments (5 * 60 seconds / 3 seconds). Each 10,000 views would consume 1 million requests. 110 videos would consume 110 million requests. Total cost? $39.6 💵</p>
                <p className="mb-4">I have assumed that we will use 3-second segments; we could also use 6-second segments, and the cost would go down by half. Would users experience any delay? Probably not, since a 6-second segment is 3.75MB and would load in &lt;1 second on most internet devices. Anyway, I digress. What&apos;s the total bill now?</p>
                <p className="mb-4">Total bill? <strong>$40 monthly</strong> (Would compound each month) 💲</p>
                <p className="mb-4">So we are now saving 97% over the cheapest option (Bunny) in the market, and 99.46% over AWS. 🎉</p>
                <p className="mb-4">Could we have used Cloudflare CDN and stored the files on our own server and let Cloudflare cache it? Well, it might goes against their T&amp;C, plus I don&apos;t want to deal with servers as much as possible. 🚫</p>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">📊 Graphs to show? 🏆</h2>
                <StorageCostChart />
                <TranscodingCostChart />
                <StreamingCostChart />
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">✨ The Moral of the Story 🏆</h2>
                <ol className="list-decimal pl-5">
                    <li><strong>FFmpeg is your new best friend</strong> 🤝</li>
                    <li><strong>Cloud giants might not always be the answer</strong> ☁️</li>
                    <li><strong>DIY can lead to massive savings</strong> 💰</li>
                    <li><strong>Cloudflare R2 is a game-changer</strong> 🌟</li>
                </ol>
            </section>


            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">For self hosters.</h2>
                <ul className="mb-4 list-disc pl-5">
                    <li>It is not necessary to use cloudflare r2, you can also use <a className="text-screen underline decoration-signal underline-offset-4 hover:decoration-2" href="https://github.com/minio/minio" target="_blank" rel="noopener noreferrer">minio</a> if you are hosting this in-house.</li>
                    <li>AWS can also be replaced with minio. minio supports webhook notifications to trigger transcoding pipelines.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">Room for improvement?</h2>
                <ul className="mb-4 list-disc pl-5">
                    <li>This project is missing ability to add subtitles, thumbnails and multi-audio streams.</li>
                    <li>The autoscaling of transcoding servers is missing.</li>
                    <li>You can substitute self hosted transcoding with AWS mediaconvert or coconut for a complete serverless experience</li>
                    <li>Postgres can be replaced with sqlite if running small instance</li>
                    <li>Self hosting transcoding might not be as efficient as cloud providers&apos;. I have heard from sources that their transcoding is better (better compression without losing on quality).</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="mb-4 text-3xl font-semibold leading-tight font-stretch-condensed tracking-tight text-screen">🚀 So what now?</h2>
                <ul className="mb-4 list-disc pl-5">
                    <li>This project is now open source for all. Feel free to self host or contribute or just raise bugs. <a className="text-screen underline decoration-signal underline-offset-4 hover:decoration-2" href="https://github.com/orthdron/subatic" target="_blank" rel="noopener noreferrer">Code Available here.</a> 📂</li>
                    <li>If you have any comments or feedback, do <a className="text-screen underline decoration-signal underline-offset-4 hover:decoration-2" href="https://x.com/Orthdron" target="_blank" rel="noopener noreferrer">tweet</a> or <a className="text-screen underline decoration-signal underline-offset-4 hover:decoration-2" href="mailto:contact@subatic.com" target="_blank" rel="noopener noreferrer">mail me</a> 📧</li>
                </ul>
            </section>
        </article>
    );
}
