import {addBed,beds,updateBed} from "../../service/hostel&PG/bed.js"
import { Router } from "express"

export const bedRoute = Router();

bedRoute.get("/beds/pg/:pgId", beds);
bedRoute.post("/bed", addBed);
bedRoute.put("/bed/:bedId", updateBed)