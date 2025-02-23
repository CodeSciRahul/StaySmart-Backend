import Owner from "../../model/owner.js";
import { sendEmail } from "../../../util/sendEmail.js";
import { Redisclient } from "../../../config/dbConnection.js";
import {promisify} from "util"

const setAsync = promisify(Redisclient.set).bind(Redisclient);


export const generateOtp = (length) => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const sendOtpToEmail = async (email) => {
  try {
    // Generate OTP
    const otp = generateOtp(6);

    // Store OTP with expiry time directly using async/await
    const key = `otp:${email}`;
    await Redisclient.set(key, otp, {
      EX: 600, // Expiry time of 5 minutes (300 seconds)
    });

    // Prepare email content
    const subject = "Your OTP";
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Your OTP</title>
    <style>
        body {
            font-family: sans-serif;
            text-align: center;
        }
        .container {
            margin: 50px auto;
            width: 300px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your OTP</h1>
        <p>Your One-Time Password (OTP) is: <b>${otp}</b></p>
        <p>Please use this OTP to complete the verification process.</p>
        <p>This OTP is valid for 10 minutes.</p>
    </div>
</body>
</html>`;

    const bodyText = `Your OTP is: ${otp}\nThis code expires in 5 minutes.`;

    // Send OTP via email
    await sendEmail(email, subject, html, bodyText);
  } catch (error) {
    throw error;
  }
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    // Check if email already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res
        .status(400)
        .send({ message: "Email already in use.", error: "exist email" });
    }

    // Create new owner
    const owner = new Owner({ name, email, password });
    await owner.save();

    //send otp to mail
   await sendOtpToEmail(email)

   res.status(201).send({ message: "Owner registered successfully. An Otp sent to your email please verify your email." });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Extract and format validation errors
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).send({
        message: validationErrors[0],
        errors: "Validation error",
      });
    }
    res.status(500).send({ message: "Server error.", error: error?.message });
  }
};
