import { Redisclient } from "../../../config/dbConnection.js";
import Owner from "../../model/owner.js";

export const verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).send({ message: "Email and OTP are required." });
      }
  
      // Connect to Redis and retrieve OTP
      const key = `otp:${email}`;
      Redisclient.get(key, async (err, storedOtp) => {
        if (err) throw err;
  
        if (!storedOtp) {
          return res.status(400).send({ message: "OTP expired or not found." });
        }
  
        if (!(storedOtp === otp)) {
          return res.status(400).send({ message: "Invalid OTP." });
        }

        // OTP is valid
        client.del(key);
        const owner = Owner.find({email})
        const tenant = Owner.find({email})
        if (owner) {
          owner.isEmailVerified = true;
          await owner.save();
          return res.status(200).send({ message: "OTP verified successfully as Owner." });
        } else if (tenant) {
          tenant.isEmailVerified = true;
          await tenant.save();
          return res.status(200).send({ message: "OTP verified successfully as Tenant." });
        }
          
        return res.status(404).send({ message: "User not found." });
      });
    } catch (error) {
      console.error(error?.message);
      res.status(500).send({ message: "Server error.", error: error?.message });
    }
};
  