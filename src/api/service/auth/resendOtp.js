import { handleError } from "../../../util/handleError.js";
import { handleSuccessRes } from "../../../util/handleRes.js";
import owner from "../../model/owner.js";
import tenant from "../../model/tenant.js";
import { sendOtpToEmail } from "../auth/register.js";

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw {
        message: "Email id is required",
        status: 400,
        isCustomError: true,
      };    }
    //verify Email is exist or not?
    let user;
    user = await tenant.findOne({ email });
    user = await owner.findOne({ email });

    if (!user) {
      throw {
        message: "User not exist",
        status: 400,
        isCustomError: true,
      };
    }
    // Send a new OTP
    await sendOtpToEmail(email);
    handleSuccessRes(null, res, "OTP resent successfully.");
  } catch (error) {
    console.error(error?.message);
    handleError(error, res);
  }
};
