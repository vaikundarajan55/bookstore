import express from "express";
import authRoutes from "./routes/authRoutes.js";
import allUsersRoutes from "./routes/allUsersRoutes.js";
import allBookRoutes from "./routes/allBookRoutes.js";

import { createSocketServer } from "./socket/socket.js";
import dotenv from 'dotenv';
import http from "http";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// VERY IMPORTANT — SERVE UPLOADS FOLDER
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/allusers', allUsersRoutes);
app.use('/api/allbooks', allBookRoutes);

// --- Create HTTP server ---
const server = http.createServer(app);

// --- Socket.io ---
createSocketServer(server);

server.listen(5001, () => {
    console.log("Server running on port 5001");
}); 