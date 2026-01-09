const mongoose = require("mongoose");

const socketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },

    voltage: { type: String, default: "0.000000" },
    current: { type: String, default: "0.000000" },
    power:   { type: String, default: "0.000000" },
    energy:  { type: String, default: "0.000000" },

    switchStatus: { type: Boolean, default: false },
    userID: { type: String, required: true },
  },
  { timestamps: true }
);

const Socket = mongoose.model("Socket", socketSchema);
module.exports = Socket;
