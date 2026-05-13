const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ username, room }) => {
    socket.join(room);
    users.set(socket.id, { username, room, color: getRandomColor() });
    
    // Notify room of new user
    io.to(room).emit('user-joined', Array.from(users.values()).filter(u => u.room === room));
  });

  socket.on('draw', (data) => {
    socket.to(data.room).emit('draw', data);
  });

  socket.on('clear-canvas', (room) => {
    socket.to(room).emit('clear-canvas');
  });

  socket.on('text-update', (data) => {
    socket.to(data.room).emit('text-update', data);
  });

  socket.on('cursor-move', (data) => {
    socket.to(data.room).emit('cursor-move', { ...data, userId: socket.id });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const { room } = user;
      users.delete(socket.id);
      io.to(room).emit('user-left', Array.from(users.values()).filter(u => u.room === room));
    }
    console.log('User disconnected:', socket.id);
  });
});

function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
