import { addRoom, deleteRoom, updateRoom } from "../../service/hostel&PG/room.js";

import { Router } from "express";

export const roomRoute = Router();

roomRoute.post("/room", addRoom);
roomRoute.put("/room/:id", updateRoom);
roomRoute.delete("/room/:id", deleteRoom);
