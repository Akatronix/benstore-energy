const Socket = require("../models/Socket.model");
const mongoose = require("mongoose");


const toNumber = (value) => {
  if (typeof value === "string") {
    const num = Number(value);
    return isNaN(num) ? value : num;
  }
  return value;
};




async function createSocket(req, res) {
  try {
    const { name, location, type } = req.body;
    if (!name || !location || !type) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newSocket = await Socket.create({
      name,
      location,
      type,
      userID: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Socket created successfully",
      socket: newSocket,
    });
  } catch (error) {
    console.error("Error creating socket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// async function getSockets(req, res) {
//   try {
//     const sockets = await Socket.find({ userID: req.user.id }).select(
//       "-userID"
//     );
//     res.status(200).json({ success: true, data: sockets });
//   } catch (error) {
//     console.error("Error fetching sockets:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }


async function updateSocketInfo(req, res) {
  try {
    const { id, name, location, type } = req.body;

    // 1. Validate Input
    if (!id || !name || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields (id, name, location, type) are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid socket ID format." });
    }

    const fieldsToUpdate = { name, location, type };
    const updatedSocket = await Socket.findByIdAndUpdate(
      id,
      { $set: fieldsToUpdate }, // <-- USE $set HERE
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    // 4. Handle "Not Found" Case
    if (!updatedSocket) {
      return res
        .status(404) // Use 404 Not Found for a missing resource
        .json({
          success: false,
          message: "Socket not found with the given ID.",
        });
    }

    // 5. Send Success Response
    res.status(200).json({
      success: true,
      message: "Socket fields updated successfully.",
      socket: updatedSocket,
    });
  } catch (error) {
    console.error("Error updating socket info:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}



async function updateSocket(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedSocket = await Socket.findOneAndUpdate(
      { _id: id, userID: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!updatedSocket) {
      return res
        .status(404)
        .json({ success: false, message: "Socket not found" });
    }
    res.status(200).json({
      success: true,
      message: "Socket updated successfully",
    });
  } catch (error) {
    console.error("Error updating socket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


async function getSockets(req, res) {
  try {
    const sockets = await Socket.find({ userID: req.user.id })
      .select("-userID")
      .lean(); // IMPORTANT: get plain JS objects

    const formattedSockets = sockets.map(socket => ({
      ...socket,
      voltage: toNumber(socket.voltage),
      current: toNumber(socket.current),
      power:   toNumber(socket.power),
      energy:  toNumber(socket.energy),
    }));

    return res.status(200).json({
      success: true,
      data: formattedSockets
    });

  } catch (error) {
    console.error("Error fetching sockets:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}



async function deleteSocket(req, res) {
  console.log("first");

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid socket ID format",
      });
    }

    const deletedSocket = await Socket.findOneAndDelete({
      _id: id,
      userID: req.user.id,
    });

    if (!deletedSocket) {
      return res.status(404).json({
        success: false,
        message: "Socket not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Socket deleted successfully",
      data: deletedSocket,
    });
  } catch (error) {
    console.error("Error deleting socket:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function updateSocketHardware(req, res) {
  try {
    const { id } = req.params;

    // Destructure from request body
    const { userId, voltage, current, power, energy } = req.body;

    // -----------------------------
    // Basic userId validation
    // -----------------------------
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "userId is required and must be a string"
      });
    }

    // -----------------------------
    // Validation helpers
    // -----------------------------
    const DECIMAL_STRING_REGEX = /^\d+(\.\d+)?$/;

    const validateDecimalString = (value, fieldName) => {
      if (value === undefined) return null;

      if (typeof value !== "string") {
        throw new Error(`${fieldName} must be a string`);
      }

      if (!DECIMAL_STRING_REGEX.test(value)) {
        throw new Error(`${fieldName} must be a valid decimal string`);
      }

      return value;
    };

    // -----------------------------
    // Build update object
    // -----------------------------
    const updates = {};

    updates.voltage = validateDecimalString(voltage, "Voltage");
    updates.current = validateDecimalString(current, "Current");
    updates.power   = validateDecimalString(power, "Power");
    updates.energy  = validateDecimalString(energy, "Energy");

    // Remove undefined fields
    Object.keys(updates).forEach(
      key => updates[key] === null && delete updates[key]
    );

    // Reject empty update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    // -----------------------------
    // Update socket
    // -----------------------------
    const updatedSocket = await Socket.findOneAndUpdate(
      { _id: id, userID: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedSocket) {
      return res.status(404).json({
        success: false,
        message: "Socket not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Socket updated successfully",
      data: updatedSocket
    });

  } catch (error) {
    console.error("Error updating socket:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}




module.exports = {
  createSocket,
  getSockets,
  updateSocket,
  deleteSocket,
  updateSocketHardware,
  updateSocketInfo
};
