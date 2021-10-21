let messageStoreObj = {};

const createRoomSpace = (room) => {
  if (!(`${room}` in messageStoreObj)) {
    messageStoreObj[room] = [];
  }
};

const addMessageToRoom = (room, messageObj) => {
  messageStoreObj[room].push(messageObj);
};

const getOldMessageOfRoom = (room) => {
  console.log("storing object: ", messageStoreObj);
  return messageStoreObj[room];
};

const deleteOldRoomMessage = (room) => {
  delete messageStoreObj[room];
  console.log("storing object: ", messageStoreObj);
};
module.exports = {
  createRoomSpace,
  addMessageToRoom,
  getOldMessageOfRoom,
  deleteOldRoomMessage,
};
