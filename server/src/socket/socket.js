import { Server } from "socket.io";

export const createSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            //origin: "http://192.168.1.103:5173",
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Receive message from client
        socket.on("sendMessage", (data) => {
            console.log("Message received:", data);

            // Broadcast to all clients
            io.emit("receiveMessage", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
