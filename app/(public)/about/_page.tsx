import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import StorageCostComparison from './storageCost';
import StreamingCostComparison from './streamingCost';
import TranscodingCostComparison from './transcodingCost';

const markdownContent = `

# The Quest for Budget-Friendly Video Hosting: A Tale of Trials and Triumphs

## TL;DR Findings 🚀
- FFmpeg is ~~hard~~ **amazingly powerful**
- Cloud providers might be charging a fortune for peanuts (possibly)
- ~~NSA~~ Cloudflare should seriously consider launching a video site

## The Genesis of Our Adventure 🌟

Picture this: A media company client approaches me with a seemingly simple request - set up a video solution. Easy peasy, right? Well, buckle up, because we're in for a wild ride!

### The Requirements (Spoiler: They're Not So Simple)
1. YouTube-like quality and speed switching 🎥
2. CDN-based for lightning-fast loading ⚡
3. Universal device compatibility 📱💻🖥️

## The Initial Research Phase 🕵️‍♂️

After some digging, I uncovered the magic formula:
- HLS stream
- Storage solution
- CDN
- Embeddable video player

Simple, right? Just find a cloud solution to transcode videos to HLS. Stream via CDN. Use any video player. No biggie!

## Let's go first round: AWS 😎

AWS seemed to have it all:
- MediaConvert for transcoding
- S3 for storage
- CloudFront for CDN

Perfect! Or so I thought...

### The Shocking Reality Check 💸

Let's crunch some numbers for a 4K video, 60 minutes long, with 100,000 viewers:

**HLS conversion (one-time)**: $4.11
   - 4K: $2.22
   - 1080p: $0.72
   - 720p: $0.72
   - 480p: $0.45  



**S3 storage (monthly)**: $0.243225 (10.575 GB × $0.023 per GB)

**CloudFront (lifetime)**: $13,800 
   - First 10 TB: $850
   - Next 40 TB: $3,200
   - Next 100 TB: $6,000
   - Remaining 75 TB: $3,750  

Our client's average video length is 5 minutes with 10,000 average views.   
   So total cost per video : $115 (13800 * 1/12th the video length * 1/10th the views)
   
Total bill? **XX,XXX$** per month! 😱

## The Client's Reality Check ☎️

> "YouTube does this for free, and you want XX,XXX$ per month?!"

Fair point, client. Fair point.

## The Quest for Alternatives 🦸‍♂️

With the client's blessing to explore non-AWS options, I embarked on a new journey.

### Enter Bunny CDN 🐰

Let's recalculate (60 minutes, 100,000 views or 2.25GB*100,000 bandwidth):

1. **HLS conversion**: $0 (it's free!)
2. **Storage (monthly)**: $0.2115 (10.575 GB × $0.02 per GB)
3. **Stream (lifetime)**: $1125

New cost per video: **$9.375**

We've cut costs by 91.85%! The client's bill now? **X,XXX$**. Better, but not quite there yet.

## DIY: The Final Frontier 🛠️

Time to roll up our sleeves and do it ourselves!

### The DIY Breakdown

1. **Transcoding**: Python script + FFmpeg magic
   - Cost: <$0.14 per hour on Hetzner Cloud

2. **Storage**: Cloudflare R2 at $15.0 / TB
   - (We passed on Backblaze at $6 / TB for reasons you'll see)

3. **CDN**: Cloudflare R2 with free egress!
   - The catch: $0.36 / million class-A requests

### The HLS Segmentation Dance 💃

- 10-minute video
- 3-second segments
- 200 segments per stream
- 10,000 streams = 2 million segments

**Total streaming cost**: $0.72

## The Grand Finale: Cost Comparison 📊

{storage-cost-comparison}

This chart compares the costs for Transcoding (60 minutes), Storage (10GB), and CDN (1TB) across AWS, Bunny CDN, and our DIY solution.

{transcoding-cost-comparison}

{streaming-cost-comparison}

## Things we skipped
### Why not just use a server like caveman and host the videos there?
Issues 1: **Concurrent users** most servers come with 1Gbps uplink. Realistically the server can handle 300 streams at any given time.
Issue 2: **Storage** Hetzner wants 54$ per 1TB of SSD storage. (I know that you can find cheaper storage servers, it's a dance between reliability and uptime)
Issue 3: **Complexity** Managing load balancers is (comparatively) hard, come with a fixed cost and do not forget the ongoing maintenance. 

I do understand that the above issues might not be an issue for you, but I wanted to design the system so it's completely hands off once deployed. I don't want a client call saying the video isn't loading because traffic spiked or the server has gone down due to some outage. There are plenty of things that can go wrong.

## The Moral of the Story 🏆

1. **FFmpeg is your new best friend** 🤝
2. **Cloud giants might not always be the answer** ☁️
3. **DIY can lead to massive savings** 💰
4. **Cloudflare R2 is a game-changer** 🌟

## What's Next? 🚀

- Optimize segment size (5 seconds could reduce costs by another 40%!)
- Explore more CDN options
- Keep an eye on emerging technologies

Remember, in the world of video hosting, creativity and persistence can lead to incredible savings. Happy hosting! 🎉

You can find the source code for the website here [subatic](https://github.com/orthdron/subatic) and for the transcoding pipeline [here](https://github.com/orthdron/subatic-transcoder)

`;

const ChartRenderer = ({ identifier }: { identifier: any }) => {
    switch (identifier) {
        case 'storage-cost-comparison':
            return <StorageCostComparison />;
        case 'transcoding-cost-comparison':
            return <TranscodingCostComparison />
        case 'streaming-cost-comparison':
            return <StreamingCostComparison />
        default:
            return null;
    }
};
export default async function Page() {
    return (
        <div className="text-gray-300 flex justify-center items-center sm:p-8 m-8 ">
            <div className="max-w-3xl w-full space-y-8 ">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-4xl sm:text-5xl font-bold text-center  text-blue-400" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-green-400 pb-4" {...props} />,
                        ul: ({ node, ...props }) => <ul className="inline pt-4 list-disc list-inside space-y-2" {...props} />,
                        p: ({ node, ...props }) => <p className="rounded-lg" {...props} />,
                        del: ({ node, ...props }) => <del className="line-through" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        // Add this new component
                        p: ({ node, children, ...props }) => {
                            if (typeof children === 'string' && children.startsWith('{') && children.endsWith('}')) {
                                return <ChartRenderer identifier={children.slice(1, -1)} />;
                            }
                            return <p className="rounded-lg" {...props}>{children}</p>;
                        },
                    }}
                >
                    {markdownContent}
                </ReactMarkdown>
            </div>
        </div>
    )
}