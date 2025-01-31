

export const handleError = (error, res) => {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ message: validationErrors[0], errors: "Validation error" });
    }
  
    // Handle unique constraint error (MongoDB duplicate key error)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // Get the field causing the duplication
      return res.status(400).send({ message: `${field} must be unique.`, errors: "Duplicate entry" });
    }
  
    return res.status(500).send({ message: "Server error", error: error.message });
  };
  