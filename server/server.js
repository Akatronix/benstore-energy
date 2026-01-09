// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const SocketRoutes = require("./src/routes/socket.route");
// const authRoutes = require("./src/routes/auth/auth.route");
// const userRoutes = require("./src/routes/auth/user.route");

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Home route
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// // API routes
// app.use("/api/sockets", SocketRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);

// // ---- VERCEL FIX: DO NOT USE app.listen() ----
// // ---- VERCEL FIX: Export handler instead ----

// // Connect to Mongo only once per cold start
// let isConnected = false;

// async function connectDB() {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     isConnected = true;
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//   }
// }

// // Vercel serverless handler
// module.exports = async (req, res) => {
//   await connectDB();
//   return app(req, res); // Express handles the request
// };

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const SocketRoutes = require("./src/routes/socket.route");
const authRoutes = require("./src/routes/auth/auth.route");
const userRoutes = require("./src/routes/auth/user.route");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Home route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// API routes
app.use("/api/sockets", SocketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT || 3000, () => {
      console.log("server runinng");
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB();
