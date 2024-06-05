const socketIO = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('joinRoom', (companyID) => {
        console.log(`User ${socket.id} joined room: ${companyID}`);
        socket.join(companyID);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
