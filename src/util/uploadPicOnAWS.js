import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { properties } from "../config/properties.js";

const SECRET_KEY = properties?.AWS_S3_SECRET_kEY
const ACCESS_KEY = properties?.AWS_S3_ACCESS_KEY
const BUCKET_NAME = properties?.AWS_S3_BUCKET_NAME
const REGION = properties?.AWS_S3_REGION

export const uploadFilesToAws = async (files) => {
  const client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  try {
    const uploadPromises = files.map(async (file) => {
      const uniqueKey = `${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: uniqueKey,
        Body: file.buffer, // Assuming file is a Buffer
        ContentType: file.mimetype, // Correct MIME type
      });

      await client.send(command);
      return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uniqueKey}`;
    });

    // Wait for all uploads to complete
    const fileUrls = await Promise.all(uploadPromises);
    return fileUrls;
  } catch (error) {
    throw new Error(error?.message || "AWS upload error");
  }
};