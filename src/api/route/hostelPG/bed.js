import {addBed,beds,bed,updateBed} from "../../service/hostel&PG/bed.js"
import { Router } from "express"

export const bedRoute = Router();

bedRoute.get("/beds/:roomId", beds);
bedRoute.get("/beds/:pgId", beds);
bedRoute.get("/bed/:bedId", bed);
bedRoute.post("/bed", addBed);
bedRoute.put("/bed/:bedId", updateBed)