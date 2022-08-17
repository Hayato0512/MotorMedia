const io = require("socket.io")(process.env.PORT || 8900, {
  cors: {
    // origin: "https://amazing-rugelach-a1abb7.netlify.app",
    origin: "https://amazing-rugelach-a1abb7.netlify.app",
    origin: "https://localhost:3000",
  },
});
let users = [];

const addUser = (userId, socketId) => {
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
  //when connect
  console.log("a user conected");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get messages
  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const user = getUser(recieverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
