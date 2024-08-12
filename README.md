![Subatic](./public/logo.webp)

The most affordable solution for hosting your videos.

[Read the origin story on how we reduced our streaming cost by 99.46%](https://subatic.com/story)

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

# Primary upload location
UPLOAD_S3_ACCESS_KEY_ID=<your_aws_access_key_id>
UPLOAD_S3_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
UPLOAD_S3_REGION=<your_aws_region>
UPLOAD_S3_BUCKET=<your_bucket_name>
UPLOAD_S3_ENDPOINT=<custom_endpoint>
# In Megabytes
MAX_FILE_SIZE=<max_file_size_in_mb>
# Final upload location url
NEXT_PUBLIC_FILE_URL=             # public S3 domain where final transcoded videos are stored
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
# Enable or disable SQS
SQS_ENABLED=false
SQS_URL=YOUR_SQS_URL

# Download bucket configuration
DOWNLOAD_S3_ENDPOINT=http://localhost:9000
DOWNLOAD_S3_ACCESS_KEY_ID=YOUR_DOWNLOAD_S3_ACCESS_KEY_ID
DOWNLOAD_S3_SECRET_ACCESS_KEY=YOUR_DOWNLOAD_S3_SECRET_ACCESS_KEY
DOWNLOAD_S3_REGION=YOUR_DOWNLOAD_S3_REGION
DOWNLOAD_S3_BUCKET=YOUR_DOWNLOAD_BUCKET_NAME

# Upload bucket configuration: Can be same as download if public
UPLOAD_S3_ACCESS_KEY_ID=YOUR_UPLOAD_S3_ACCESS_KEY_ID
UPLOAD_S3_SECRET_ACCESS_KEY=YOUR_UPLOAD_S3_SECRET_ACCESS_KEY
UPLOAD_S3_REGION=YOUR_UPLOAD_S3_REGION
UPLOAD_S3_BUCKET=YOUR_UPLOAD_BUCKET_NAME
UPLOAD_S3_ENDPOINT=YOUR_UPLOAD_S3_ENDPOINT

# Webhook configuration
WEBHOOK_URL=http://localhost:3000/
WEBHOOK_TOKEN=YOUR_WEBHOOK_TOKEN
```

#### For PostgreSQL

```plaintext
POSTGRES_USER=postgres
POSTGRES_PASSWORD=                # Your PostgreSQL password
```

#### For MinIO

```plaintext
MINIO_ACCESS_KEY=                 # Your MinIO access key
MINIO_SECRET_KEY=                 # Your MinIO secret key
```

Replace the empty values with your actual configuration details.

More detailed documentation will be available soon. For any bugs, please report them using GitHub Issues.

If you have questions, feel free to reach out:

- [Contact on X](https://x.com/orthdron)
