import jwt from "jsonwebtoken";
import Owner from "../../model/owner.js";
import { properties } from "../../../config/properties.js";
import Tenant from "../../model/tenant.js";

const JWT_SECRET = properties?.JWT_SECERT_KEY;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required." });
    }

    // Find the owner by email
    const owner = await Owner.findOne({ email });
    const tenant = await Tenant.findOne({email});
    if (!owner && !tenant) {
      return res.status(400).send({ message: "Invalid email or password." });
    }

    const user = owner ? owner : tenant
    
    if(!user?.isEmailVerified) {
      return res.status(401).send({message: "You are not verified."})
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, name: user?.name, role: user?.role, email: user?.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).send({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error(error?.message);
    res.status(500).send({ message: "Server error.", error: error?.message });
  }
};
