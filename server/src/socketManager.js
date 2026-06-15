import { Server } from "socket.io";

let io;

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - The HTTP server instance
 * @returns {Server} - Socket.IO server instance
 */
export const initializeSocketIO = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected via Socket.IO:", socket.id);

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });

    return io;
};

/**
 * Get the initialized Socket.IO instance
 */
export const getSocketIo = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized! Call initializeSocketIO first.");
    }
    return io;
};