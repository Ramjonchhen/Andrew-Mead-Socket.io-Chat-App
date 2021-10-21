const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/message.js");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users.js");

const {
  createRoomSpace,
  addMessageToRoom,
  getOldMessageOfRoom,
  deleteOldRoomMessage,
} = require("./utils/messageStore");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("join", (options, callback) => {
    // for regular socket connection
    // socket.emit io.emit socket.broadcast.emit

    // for room connections
    // io.emit and socket.broadcast.emit

    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    // creating a room space in message storing object
    createRoomSpace(user.room);

    socket.join(user.room);

    const oldMessageToSend = getOldMessageOfRoom(user.room);

    if (oldMessageToSend.length !== 0) {
      socket.emit(
        "message",
        generateMessage(
          "Old Messages of the Room Starting From Here...",
          "From The Room"
        )
      );

      oldMessageToSend.forEach((obj) => {
        socket.emit("message", obj);
      });

      socket.emit(
        "message",
        generateMessage(
          "Old Messages of the Room Ending  From Here...",
          "From The Room"
        )
      );
    }

    socket.emit(
      "message",
      generateMessage("Welcome To The Room", "From The Room")
    );

    const generatedObj = generateMessage(
      `${user.username} has joined!`,
      `From The Room`
    );

    addMessageToRoom(user.room, generatedObj);

    socket.broadcast.to(user.room).emit("message", generatedObj);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("The Given Message Contains Bad Words");
    }

    const { room, username } = getUser(socket.id);

    const messageObj = generateMessage(message, username);

    addMessageToRoom(room, messageObj);

    io.to(room).emit("message", messageObj);
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const { room, username } = getUser(socket.id);

    const locationObject = generateLocationMessage(
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
      username
    );

    addMessageToRoom(room, locationObject);

    io.to(room).emit("locationMessage", locationObject);
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left the chat.`, `From The Room`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      if (getUsersInRoom(user.room).length === 0) {
        deleteOldRoomMessage(user.room);
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
