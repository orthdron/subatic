# Subatic

The most affordable solution for hosting your videos. Learn more about us here: [About Subatic](https://subatic.com/about)

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

10. **Set Up the Transcoding Pipeline**: Refer to the [Transcoding Repository](https://github.com/orthdron/subatic-transcoding) for instructions.
11. **Deploy Your Application**: During deployment, make sure to set the following environment variables:

### Environment Variables for Subatic

```plaintext
DATABASE_URL=                     # Connection string for your PostgreSQL database
AWS_ACCESS_KEY_ID=                # Your AWS access key
AWS_SECRET_ACCESS_KEY=            # Your AWS secret key
AWS_REGION=                       # AWS region where your resources are located
BUCKET_NAME=                      # Name of your S3 bucket
MAX_FILE_SIZE=                    # Maximum file size for uploads (in Megabytes)
NEXT_PUBLIC_FILE_URL=             # Cloudflare R2 public domain
WEBHOOK_TOKEN=                    # Random Token for webhook notifications. Shared between this and transcoder.
```

### Environment Variables for Subatic-Transcoder

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

More detailed documentation will be available soon. For any bugs, please report them using GitHub Issues.

If you have questions, feel free to reach out:

- [Contact on X](https://x.com/orthdron)
- [Email Us](mailto:contact@subatic.com)
