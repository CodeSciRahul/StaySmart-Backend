import dotenv from "dotenv"
dotenv.config();

export const properties = {
    SECERT_KEY: process.env.SECERT_KEY,
    SALT_ROUND: process.env.SALT_ROUND,
    PORT: Number(process.env.PORT),
    MOONGO_URI: process.env.MOONGO_URI 
}