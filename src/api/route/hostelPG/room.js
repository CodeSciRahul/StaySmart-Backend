import {
  addRoom,
  deleteRoom,
  getAllRooms,
  getSignleRoom,
  updateRoom,
} from "../../service/hostel&PG/Room.js";

import { Router } from "express";

export const roomRoute = Router();


roomRoute.post("/room", addRoom);
roomRoute.put("/room/:id", updateRoom);
roomRoute.delete("/room/:id", deleteRoom);
roomRoute.get("/rooms", getAllRooms);
roomRoute.get("/room/:id", getSignleRoom);
