![Subatic](./public/logo.webp)

The most affordable solution for hosting your videos. Learn more about us here: [About Subatic](https://subatic.com/about)

![Architecture](./docs/assets/architecture.png)

## Setup Instructions

Follow these steps to get started:

1. **Create an AWS S3 Bucket**
2. **Connect the S3 Bucket to SQS**: Refer to the [AWS Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ways-to-add-notification-config-to-bucket.html) for guidance.
3. **Generate an AWS API Key**: Ensure it has permissions to access the S3 bucket and SQS.
4. **Set Up a PostgreSQL Database**
5. **Create a Cloudflare Account**
6. **Create an R2 Bucket**
7. **Generate API Keys**: Obtain the necessary keys to access the R2 bucket.
8. **Make the Bucket Public**: Connect a domain to the bucket for public access.
9. **Set CORS Policy**: Use the following CORS configuration for your R2 bucket:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["range"],
    "ExposeHeaders": ["Content-Type", "Access-Control-Allow-Origin", "ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

10. **Enable caching in Cloudflare**: Refer to [Cloudflare Documentation](https://developers.cloudflare.com/cache/how-to/cache-rules/create-dashboard/) and [this](https://developers.cloudflare.com/cache/how-to/cache-rules/examples/cache-everything/) on how to enable caching for your public domain that is connected to R2.
11. **Set Up the Transcoding Pipeline**: Refer to the [Transcoding Repository](https://github.com/orthdron/subatic-transcoding) for instructions.
12. **Deploy Your Application**: During deployment, make sure to set the environment variables listed below.

## Docker Compose Deployment

We provide a `docker-compose.yml` file for easy deployment of Subatic, Subatic Transcoder, and PostgreSQL. To use it:

1. Create a `.env` file in the same directory as your `docker-compose.yml` file.
2. Add all the required environment variables (listed below) to the `.env` file.
3. Run the following command to start the services:

   ```
   docker-compose up -d
   ```

The Docker Compose file includes health checks and proper service dependencies to ensure a smooth startup process.

### Environment Variables

Make sure to set the following environment variables in your `.env` file:

#### For Subatic

```plaintext
DATABASE_URL=                     # Connection string for your PostgreSQL database
AWS_ACCESS_KEY_ID=                # Your AWS access key
AWS_SECRET_ACCESS_KEY=            # Your AWS secret key
AWS_REGION=                       # AWS region where your resources are located
BUCKET_NAME=                      # Name of your S3 bucket
MAX_FILE_SIZE=                    # Maximum file size for uploads (in Megabytes)
NEXT_PUBLIC_FILE_URL=             # Cloudflare R2 public domain
WEBHOOK_TOKEN=                    # Random Token for webhook notifications. Shared between this and transcoder.

# Optional variables

ENABLE_UMAMI="true"               # Enable / Disable Umami analytics
UMAMI_URL=<umami-hosted-url>      # URL of your Umami instance
UMAMI_ID=<data-website-id_from_umami>  # Website ID from Umami for tracking

ENABLE_PLAUSIBLE="false"          # Enable / Disable Plausible analytics
PLAUSIBLE_HOST=<plausible-hosted-url>  # URL of your Plausible instance
PLAUSIBLE_DOMAIN=<your-domain>    # Your domain for tracking with Plausible

ENABLE_GOOGLE_ANALYTICS="false"   # Enable / Disable Google Analytics
GOOGLE_ANALYTICS_ID=<ga-id>       # Your Google Analytics tracking ID
```

#### For Subatic-Transcoder

```plaintext
# AWS Configuration
AWS_ACCESS_KEY_ID_1=             # Your AWS access key for transcoding
AWS_SECRET_ACCESS_KEY_1=         # Your AWS secret key for transcoding
AWS_BUCKET_1=                     # The S3 bucket used for transcoding
AWS_SQS_URL=                      # URL of the SQS queue for transcoding
AWS_REGION=                       # AWS region for transcoding resources

# Cloudflare Configuration
AWS_ACCESS_KEY_ID_2=             # Your Cloudflare access key
AWS_SECRET_ACCESS_KEY_2=         # Your Cloudflare secret key
AWS_BUCKET_2=                     # The R2 bucket used for final uploads
AWS_ENDPOINT_2=                   # Endpoint for accessing the R2 bucket

WEBHOOK_URL=                      # URL for webhook notifications (where subatic is deployed)
WEBHOOK_TOKEN=                    # Random Token for webhook notifications. Shared between this and transcoder.
```

#### For PostgreSQL

```plaintext
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
```

Replace the empty values with your actual configuration details.

More detailed documentation will be available soon. For any bugs, please report them using GitHub Issues.

If you have questions, feel free to reach out:

- [Contact on X](https://x.com/orthdron)
