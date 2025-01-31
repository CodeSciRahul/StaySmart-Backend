import {
  AddHostelPG,
  deleteHostelPG,
  getAllHostelsPGs,
  getHostelPGById,
  updateHostelPG,
} from "../../service/hostel&PG/hostel.js";
import {protectOwnerRoute} from "../../middleware/protectRoute/owner.js"
import {uploader} from "../../middleware/multer.js"
import { Router } from "express";

export const hostelPGRoute = Router();

hostelPGRoute.post("/hostelPG", protectOwnerRoute, uploader.array("files", 5), AddHostelPG)
hostelPGRoute.put("/hostelPG/:id",protectOwnerRoute, updateHostelPG)
hostelPGRoute.delete("/hostelPG/:id", protectOwnerRoute, deleteHostelPG)
hostelPGRoute.get("/hostelPG", getAllHostelsPGs)
hostelPGRoute.get("/hostelPG", getHostelPGById)


