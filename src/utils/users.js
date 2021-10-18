const users = [];

// addUser, removeUser, getUser, getUsersInRooms

const addUser = ({ id, username, room }) => {
  // clean the data remove any empty spaces
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // check whether the username and room are provided or not
  if (!username || !room) {
    return {
      error: "Both Username and Room are required.",
    };
  }

  // check whether the joining username has been already taken in the room or not
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // if user is already present in the room then sending error
  if (existingUser) {
    return {
      error: "Username Has Already been takne.",
    };
  }

  // storing the user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (roomName) => {
  roomName = roomName.trim().toLowerCase();
  return users.filter((userObj) => userObj.room === roomName);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
