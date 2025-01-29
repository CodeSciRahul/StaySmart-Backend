import {sendOtpToEmail} from "../auth/register.js"

export const resendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).send({ message: "Email is required." });
      }
  
      // Send a new OTP
      await sendOtpToEmail(email);
  
      res.status(200).send({ message: "OTP resent successfully." });
    } catch (error) {
      console.error(error?.message);
      res.status(500).send({ message: "Server error.", error: error?.message });
    }
  };
  