import mongoose from "mongoose";
import redis from "redis"
import { properties } from "./properties.js";
export const connectDB = async(mongoUrl) => {
    const db_config_object = { 
        // ssl: true, 
    };
    mongoose
    .connect(mongoUrl, db_config_object)
    .then(() => {
        console.log("Connected to Database!");
    })
    .then((err) => {
        if(err) console.log(err);
    })
}

export const Redisclient = redis.createClient({
    socket: {
        host: '127.0.0.1', // Force IPv4
        port: 6379,
    },
});