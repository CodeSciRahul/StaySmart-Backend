import Tenant from "../../model/tenant.js"
import {handleSuccessRes} from "../../../util/handleRes.js"
import { handleError } from "../../../util/handleError.js";

export const createTenant = async(req, res) => {
    try {
        const name = req.body.name;
        const dob = req.body.dob;
        const dobString = dob.toISOString().split('T')[0];  
        const password = name + dobString;
        const payload = {...req.body, password};
        const newTenant = new Tenant(payload);
        newTenant.save();
        handleSuccessRes(
            null,
            res, 
            "Registration successfully completed",
        )

    } catch (error) {
        handleError(error, res)
    }
}