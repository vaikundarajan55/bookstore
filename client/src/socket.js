// frontend/src/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {

});

socket.on('connect', () => {
    //console.log('Connected to Socket.IO server:', socket.id);
});

socket.on('disconnect', () => {
    //console.log('Disconnected from Socket.IO server.');
});

/* socket.on('connect_error', (err) => {
  //console.error('Socket.IO connection error:', err.message);
}); */

export default socket;