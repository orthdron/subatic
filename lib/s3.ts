import { S3Client } from "@aws-sdk/client-s3";

export function createS3Client() {
    const accessKeyId = process.env.RAWFILES_S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.RAWFILES_S3_SECRET_ACCESS_KEY;
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "0", 10) * 1024 * 1024;
    const bucketName = process.env.RAWFILES_S3_BUCKET;
    const endpoint = process.env.RAWFILES_S3_ENDPOINT;
    const region = process.env.RAWFILES_S3_REGION || "auto";

    // Check for required environment variables
    if (!accessKeyId || !secretAccessKey || !maxFileSize || !bucketName || (!region && !endpoint)) {
        return { error: "This functionality is down. Please come back later." };
    }

    // Configure S3 client
    const s3ClientConfig: any = {
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
        forcePathStyle: true,
        region: region,
    };
    if (endpoint) {
        s3ClientConfig.endpoint = endpoint;
    }


    // Create and return the S3 client
    const s3client = new S3Client(s3ClientConfig);
    return { s3client };
}
