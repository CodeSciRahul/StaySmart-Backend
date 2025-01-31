import dotenv from "dotenv"
dotenv.config();

export const properties = {
    JWT_SECERT_KEY: process.env.JWT_SECERT_KEY,
    SALT_ROUND: process.env.SALT_ROUND,
    PORT: Number(process.env.PORT),
    MOONGO_URI: process.env.MOONGO_URI, 
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SENDER_EMAIL: process.env.SENDER_EMAIL,
    AWS_REGION: process.env.AWS_REGION,
    REDIS_PORT: process.env.REDIS_PORT,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_kEY: process.env.AWS_S3_SECRET_kEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_REGION: process.env.AWS_S3_REGION

}