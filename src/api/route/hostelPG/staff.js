import Staff from "../../model/staff.js";
import { handleError } from "../../../util/handleError.js";
import { handleSuccessRes } from "../../../util/handleRes.js";

// Add a new staff member
export const addStaff = async (req, res) => {
  try {
    const { name, role, contact, address, salary, pgId } = req.body;

    // Create a new staff member
    const newStaff = new Staff({
      name,
      role,
      contact,
      address,
      salary,
      pgId,
    });

    // Save the staff member to the database
    await newStaff.save();
    handleSuccessRes(newStaff, res, "Staff added successfully");
  } catch (error) {
    handleError(error, res);
  }
};

// Update a staff member
export const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { name, role, contact, address, salary, status } = req.body;

    // Validate if staffId is provided
    if (!staffId) {
      throw {
        message: "Staff Id is required",
        status: 400,
        isCustomError: true,
      };
    }

    // Find the staff member by ID and update
    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { name, role, contact, address, salary, status },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    // Check if the staff member exists
    if (!updatedStaff) {
      throw {
        message: "Staff Member does not exist",
        status: 400,
        isCustomError: true,
      };
    }

    handleSuccessRes(updateStaff, res, "Staff updated successfully");
  } catch (error) {
    handleError(error, res);
  }
};

// Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const { pgId } = req.params;
    if (!pgId) {
      throw {
        message: "Pg Id is required",
        status: 400,
        isCustomError: true,
      };
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    const staffMembers = await Staff.find({ pgId }).skip(skip).limit(limit);
    const totatStaff = Staff.countDocuments();
    //meta data about pagination.
    const totalPages = Math.ceil(totatStaff / limit);
    const previousPage = page - 1 === 0 ? null : page - 1;
    const nextPage = page >= totalPages ? null : page + 1;
    const meta = {
      totatStaff,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      previousPage,
      nextPage,
    };
    handleSuccessRes(
      staffMembers,
      res,
      "Staff Members reterived successfully",
      meta
    );
  } catch (error) {
    handleError(error, res);
  }
};
