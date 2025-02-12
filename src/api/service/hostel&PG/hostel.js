import HostelPG from "../../model/hostelpg.js";
import { uploadFilesToAws } from "../../../util/uploadPicOnAWS.js";
import {handleError} from "../../../util/handleError.js"

// ✅ Add Hostel/PG
export const AddHostelPG = async (req, res) => {
  try {
    const { name, address, features, meal, ownerId } = req.body;
    const files = req.files;

    let uploadedImagesURL 
    if(files) {
      uploadedImagesURL = await uploadFilesToAws(files);
    }

    const hostelPG = new HostelPG({
      name,
      address,
      features,
      ownerId,
      meal,
      images: uploadedImagesURL,
    });
    await hostelPG.save();

    return res
      .status(200)
      .send({ message: "Hostel or PG added successfully", data: hostelPG });
  } catch (error) {
    handleError(error, res);
  }
};

// ✅ Get All Hostels/PGs
export const getAllHostelsPGs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const [HostelPGs, totalHostelPGs] = await Promise.all([
    HostelPG.find()
      .limit(limit)
      .skip(skip)
      .populate('ownerId', '_id name email phone'),
    HostelPG.countDocuments()
    ])

    //meta data about pagination.
    const totalPages = Math.ceil(totalHostelPGs / limit);
    const previousPage = page - 1 === 0 ? null : page - 1;
    const nextPage = page >= totalPages ? null : page + 1;
    return res.status(200).send({
      data: HostelPGs,
      meta: {
        totalHostelPGs,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        previousPage,
        nextPage,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

// ✅ Get Single Hostel/PG by ID
export const getHostelPGById = async (req, res) => {
  try {
    const { id } = req.params;
    const hostelPG = await HostelPG.findById(id);
    if (!hostelPG)
      return res.status(404).send({ message: "Hostel/PG not found" });

    return res.status(200).send({ data: hostelPG });
  } catch (error) {
    handleError(error, res);
  }
};

// ✅ Update Hostel/PG
export const updateHostelPG = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, features, meal } = req.body;
    const files = req.files;
    console.log(name, address, features, meal, files)

    const hostelPG = await HostelPG.findById(id);
    if (!hostelPG)
      return res.status(404).send({ message: "Hostel/PG not found" });

    let ImageUrls;
    if(files){
      ImageUrls = await uploadFilesToAws(files);
    }
    console.log("Image url", ImageUrls)


    hostelPG.name = name || hostelPG.name;
    hostelPG.address = address || hostelPG.address;
    hostelPG.features = features || hostelPG.features;
    hostelPG.meal = meal || hostelPG.meal;
    hostelPG.images = ImageUrls || hostelPG.images

    await hostelPG.save();

    return res
      .status(200)
      .send({ message: "Hostel/PG updated successfully", data: hostelPG });
  } catch (error) {
    handleError(error, res);
  }
};

// ✅ Delete Hostel/PG
export const deleteHostelPG = async (req, res) => {
  try {
    const { id } = req.params;
    const hostelPG = await HostelPG.findByIdAndDelete(id);

    if (!hostelPG)
      return res.status(404).send({ message: "Hostel/PG not found" });

    return res.status(200).send({ message: "Hostel/PG deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};
