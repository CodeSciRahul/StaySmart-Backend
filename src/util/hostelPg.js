import Bed from "../../src/api/model/bed.js";
import Room from "../api/model/room.js";
import Booking from "../api/model/booking.js";
import {handleError} from "./handleError.js";

export const checkRoomVacancy = async(roomNumber, pgId) => {
    try {
        const room = await Room.findOne({roomNumber, pgId})

        if (!room) {
            throw {
              message: "Room not found",
              status: 404,
              isCustomError: true,
            };
          }
      
        const result = await Bed.aggregate([
            { $match: { roomId: room._id } }, // Match beds based on roomId
            {
              $group: {
                _id: "$roomId", 
                totalBeds: { $sum: 1 },
                occupiedBeds: {
                  $sum: {
                    $cond: [{ $ne: ["$tenantId", null] }, 1, 0], 
                  },
                },
              },
            },
            {
              $project: {
                roomId: "$_id", 
                totalBeds: 1,
                occupiedBeds: 1,
                status: {
                  $cond: [
                    { $eq: ["$totalBeds", 0] },
                    "No beds available",
                    {
                      $cond: [
                        { $eq: ["$occupiedBeds", "$totalBeds"] },
                        "Full",
                        "Vacant",
                      ],
                    },
                  ],
                },
              },
            },
          ]);

        return result[0]
    } catch (error) {
      throw error
    }

}


export const isBedAvailable = async(bedId) => {
  try {
    const bed = await Bed.findById(bedId);
    if(!bed) {
      throw {
        message: "Bed does not exist",
        status: 404,
        isCustomError: true
      }
    }
    const activeBooking = await Booking.findOne({
      bedId,
      status: {$in: ["Pending", "Confirmed"]}
    });
    return !activeBooking
  } catch (error) {
    throw error
  }
}
