import Booking from "../../model/booking.js"
import Payment from "../../model/payment.js"
import mongoose from "mongoose";
import { handleError } from "../../../util/handleError.js";
import {handleSuccessRes} from "../../../util/handleRes.js"


//tenant have this api access
export const createPayment = async(req, res) => {
    const session = mongoose.startSession();
    session.startTransaction()
    try {
        const {bookingId, paymentMethod} = req.body

        const booking = await Booking.findOne({ _id: bookingId, status: { $ne: "Cancelled" } }).populate('bedId');        
        if(!booking) {
            throw {
                message: "Booking not found",
                status: 404,
                isCustomError: true
            }
        }
        const {status, bedId} = booking
        const {price} = bedId;

        if(!(status === "Pending")){
            throw {
                message: "Booking has been cancelled or confirmed",
                status: 400,
                isCustomError: true
            }
        }
        let newPayment;
        let paymentPayload = dynamicPaymentPayload(req.body, price);
        let message;
        
        //if payment method is cash
        if(paymentMethod === "Cash") {
            newPayment = new Payment(paymentPayload);
            await newPayment.save({session});
            message = ""
        }

        // if(paymentMethod === "Online"){
        // }

        await session.commitTransaction();
        handleSuccessRes(
            newPayment,
            res,
            message
        )

    } catch (error) {
    await session.abortTransaction();
    handleError(error, res);
    } finally {
        await session.endSession()
    }
}

//only owner have this api access
export const verifyPayment = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { paymentStatus} = req.body
        const {paymentId} = req.params
        if(!paymentStatus) {
            throw {
                message: "paymentStatus is required",
                status: 400,
                isCustomError: true
            }
        }
        if(paymentStatus === "Pending") {
            throw {
                message: "Payment is already in Pending state",
                status: 400,
                isCustomError: true
            }
        }
       const newPayment = await Payment.findOneAndUpdate({_id: paymentId, status: {$ne: ['Failed', 'Cancelled', 'Successful']}}, {status: paymentStatus}, {new: true, session});

       const { bookingId } = newPayment;

       if(!newPayment) {
        throw {
            message: "You can not modify Failed, Cancelled or Successfully Completed payment",
            status: 400,
            isCustomError: true
        }
       }

        const bookingStatus = paymentStatus === "Successful" ? "Confirmed" : "Cancelled"
        await Booking.findOneAndUpdate({bookingId}, {status: bookingStatus}, {new: true, session});

        await session.commitTransaction();
        handleSuccessRes(
            null,
            res,
            "Payment status updated successfully"
        )
        
    } catch (error) {
        await session.abortTransaction()
        handleError(error, res)
    } finally{
        session.endSession();
    }
}


const dynamicPaymentPayload = (paymentPayload, price) => {
    const {bookingId, paymentType, amountPaid, dueDate, paymentMethod, paymentDetails} = paymentPayload;
    const basePaymentPayload = {
        bookingId,
        paymentType,
        amountPaid: amountPaid,
        amount: price,
        amountDue: price - amountPaid,
      };
    
    switch(paymentType){
        case "Full":
            break;
        
        case "Partial":
            basePaymentPayload.dueDate = dueDate;
            break;

        case "PayLater":
            basePaymentPayload.dueDate = dueDate;
            basePaymentPayload.amountPaid = 0;
            break;
        
        default: throw {
            message: "Invalied paymentType",
            status: 400,
            isCustomError: true
        }
    }
     
    switch(paymentMethod) {
        case "Cash":
            break;
        
        case "Online":
            basePaymentPayload.paymentDetails = paymentDetails;
            break;
        
        default: throw {
                message: "Invalied paymentMethod",
                status: 400,
                isCustomError: true
            }
    }

    return basePaymentPayload;

}