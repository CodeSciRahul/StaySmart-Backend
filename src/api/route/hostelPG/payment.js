import {createPayment,verifyPayment} from "../../service/hostel&PG/payment.js"
import {protectTenantRoute} from "../../middleware/protectRoute/tenant.js"
import {protectOwnerRoute} from "../../middleware/protectRoute/owner.js"

import { Router } from "express"

export const paymentRoute = Router();

paymentRoute.post("/create-payment",protectTenantRoute, createPayment)
paymentRoute.put("/verify-payment", protectOwnerRoute, verifyPayment)