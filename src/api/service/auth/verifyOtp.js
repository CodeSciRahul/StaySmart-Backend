import { Redisclient } from "../../../config/dbConnection.js";
import Owner from "../../model/owner.js";
import Tenant from "../../model/tenant.js";
import { handleError } from "../../../util/handleError.js";
import { handleSuccessRes } from "../../../util/handleRes.js";

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw {
        message: "Email and OTP are required.",
        status: 400,
        isCustomError: true,
      };
    }

    // Retrieve OTP from Redis with expiry check
    const key = `otp:${email}`;
    const storedOtp = await Redisclient.get(key);

    if (!storedOtp) {
      throw {
        message: "OTP expired or not found.",
        status: 400,
        isCustomError: true,
      };
    }

    if (storedOtp !== otp) {
      throw {
        message: "Invalid OTP.",
        status: 400,
        isCustomError: true,
      };
    }

    // Delete OTP after successful verification
    await Redisclient.del(key);

    // Check if the user exists in Owner or Tenant collections
    let user = await Owner.findOne({ email });

    if (!user) {
      user = await Tenant.findOne({ email });
    }

    if (!user) {
      throw {
        message: "User not found",
        status: 404,
      };
    }

    // Update verification status
    user.isEmailVerified = true;
    await user.save();

    return handleSuccessRes(null, res, "OTP verified successfully.");
  } catch (error) {
    handleError(error, res);
  }
};
