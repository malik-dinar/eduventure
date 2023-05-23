const { Server } = require("socket.io");

const initializeSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_CONNECTION,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  let users = [];

  const addUser = (userId, socketId) => {
    console.log('on is not');
    console.log(userId,socketId);
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    // when connect
    // console.log("connection established", socket.id);
    // take userId and socketId from user...
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // sent and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      console.log(receiverId,senderId,text);
      const user = getUser(receiverId);
      console.log(users);
      console.log(user);
      io.emit("getMessage", {
        receiverId,
        senderId,
        text,
      });
    });

    // when disconnect
    socket.on("disconnect", () => {
      console.log("a user is disconnect");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });

  io.on("error", (error) => {
    console.log("IO error:", error);
  });
};

module.exports = { initializeSocket };
