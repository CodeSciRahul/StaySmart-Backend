import {createBooking} from "../../service/hostel&PG/booking.js"
import { protectTenantRoute } from "../../middleware/protectRoute/tenant.js";
import { Router } from "express"

export const bookingRoute = Router();

bookingRoute.post("/booking",protectTenantRoute, createBooking);