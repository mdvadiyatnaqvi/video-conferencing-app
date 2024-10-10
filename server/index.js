import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import roomHandler from "./socket/roomHandler.js";
import authRoutes from "./routes/auth.js";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/auth", authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Debugging: Log the MONGO_URL to ensure it's being loaded
console.log("MONGO_URL:", process.env.MONGO_URL);

const PORT = process.env.PORT || 6001;
const MONGO_URL =
  "mongodb+srv://mdvadiyatnaqvi:8lYRPn161UlQh0VX@cluster0.c0ucd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error:", err);
  });
