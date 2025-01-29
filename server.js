import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import {connectDB} from "./src/config/dbConnection.js";
import { properties } from "./src/config/properties.js";
import { Redisclient } from "./src/config/dbConnection.js";
import { authRoute } from "./src/api/route/auth/auth.js";

//connect DB
connectDB(properties.MOONGO_URI).catch(err => {
    console.error('Failed to connect to MongoDB', err)});

Redisclient.connect()
.then(() => console.log("Connected to Redis!"))
.catch((err) => console.error("Failed to connect Redis",err));

const app = express();

// Updated CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOptions));

// Preflight requests handler
app.options("*", cors(corsOptions)); // Handles preflight for all routes
app.use(bodyParser.json());

const port = properties.PORT;

app.get("/", async (req, res) => {
    return res.send(`<h1>Running backend on Port : ${port}</h1>`);
  });


  //different route
  app.use("/api", authRoute);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Open Browser: http://localhost:${port}`);
  });