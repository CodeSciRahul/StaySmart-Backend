import { register } from "../../service/auth/register.js"
import { resendOtp } from "../../service/auth/resendOtp.js"
import { verifyOtp} from "../../service/auth/verifyOtp.js"
import { login } from "../../service/auth/login.js"
import { Router } from "express"
 
export const authRoute = Router()

authRoute.post("/register", register)
authRoute.post("/resend-otp", resendOtp)
authRoute.patch("/verify-otp", verifyOtp)
authRoute.post("/login", login)