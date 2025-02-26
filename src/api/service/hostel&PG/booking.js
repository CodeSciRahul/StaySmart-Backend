import Bed from "../../model/bed.js";
import Booking from "../../model/booking.js";
import mongoose from "mongoose";
import { isBedAvailable } from "../../../util/hostelPg.js";
import { handleError } from "../../../util/handleError.js";
import { handleSuccessRes } from "../../../util/handleRes.js";

//tenant have this api access
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tenantId, bedId, startDate, endDate } = req.body;
    if (!(tenantId || bedId)) {
      throw {
        message: "All fields are required",
        status: 400,
        isCustomError: true,
      };
    }
    const activeBooking = isBedAvailable(bedId);
    if (!activeBooking) {
      throw {
        message: "Bed has been Ocupied",
        status: 400,
        isCustomError: true,
      };
    }
    //bed me tenant Id daalo 1
    await Bed.findOneAndUpdate(
      { _id: bedId },
      { tenantId },
      { new: true, session }
    );
    //booking me bed id daalo 2
    const booking = new Booking({ bedId, startDate, endDate });
    await booking.save({ session });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "bedId",
        populate: { path: "tenantId",
            select: "name email images meal" 
         }, // Populate tenantId inside bedId
      })
      .session(session);
    await session.commitTransaction();

    handleSuccessRes(populatedBooking, res, "Booking successfully created");
  } catch (error) {
    await session.abortTransaction();
    handleError(error, res);
  } finally {
    await session.endSession();
  }
};
