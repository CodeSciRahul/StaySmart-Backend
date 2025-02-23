import mongoose from "mongoose";
import Room from "../../model/room.js";
import { handleError } from "../../../util/handleError.js";

// Create a Room
export const addRoom = async (req, res) => {
  try {
    const { pgId, roomNumber, roomType, features } = req.body;

    const room = new Room({ pgId, roomNumber, roomType, features });
    await room.save();

    res.status(201).send({ message: "Room created successfully", data: room });
  } catch (error) {
    handleError(error, res);
  }
};

// Update a Room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber, roomType, features } = req.body;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    //update room
    room.roomNumber = roomNumber || room.roomNumber;
    room.roomType = roomType || room.roomType;
    room.features = features || room.features;

    await room.save();

    res.status(200).send({ message: "Room updated successfully", data: room });
  } catch (error) {
    handleError(error, res);
  }
};

// Delete a Room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(404).send({ message: "Room not found" });
    }

    res.status(200).send({ message: "Room deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};
