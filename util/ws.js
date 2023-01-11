"use strict";

// STRICT MODE HERE

const { Server, Socket } = require("socket.io");
const { getUserWs, onMessage, onMessageEdit, onMessageDelete } = require("./wsUtil");
const { wsValidator } = require("./validators");
const { CLIENT_URI } = process.env;

const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  IDENTIFY: "identify",
  ERROR: "error",

  ONLINE: "user_online",
  OFFLINE: "user_offline",

  MESSAGE: "message",
  MESSAGE_EDIT: "message_edit",
  MESSAGE_DELETE: "message_delete",

  // STATUS: "status", // dijadiin satu sama user update
  USER_UPDATE: "user_update",

  GROUP_CREATE: "group_create",
  GROUP_JOIN: "group_join",
  GROUP_LEAVE: "group_leave",
  GROUP_DELETE: "group_delete",
  GROUP_UPDATE: "group_update",

  FRIEND_REQUEST: "friend_request",
  FRIEND_REQUEST_DELETE: "friend_request_delete",
  FRIEND_REQUEST_ACCEPT: "friend_request_accept",

  CALL: "call",
  CALL_CONNECT: "call_connect",
  ACCEPT_CALL: "accept_call",
  CALL_ACCEPT: 'call_accepted',
  CLICK_CALL: 'clickCall',
  INCOMING_CALL: 'incomingCall',
  CANCEL_CALL: 'cancelCall',
  CALL_IS_CANCELLED: 'callIsCanceled',
  DECLINE_CALL: 'declineCall',
  CALL_IS_DECLINED: 'callIsDeclined',
  LEAVE_CALL: 'leaveCall',
  USER_LEAVES_THE_CALL: 'anotherUserLeaveTheCall',
  ACCEPT_VIDEO: 'acceptCall',
  CONFIRM_ACCEPT_VIDEO: 'confirmAcceptCall',

  SCHEDULE: "schedule",
  SCHEDULE_CANCEL: "schedule_cancel",
}

/**
* @type {import("socket.io").Socket}
*/
let io;

/**
* @type {Map<number, import("socket.io").Socket>}
*/
const userSockets = new Map();

// ============= PRIVATE FUNCTIONS =============

const jString = (object) => {
  return object;
  // return JSON.stringify(object);
}

const jParse = (str) => {
  return str;
  // return JSON.parse(str);
}

const validateUserId = (userId) => {
  return wsValidator("number", userId, "Expected userId to be number, got " + userId);
}

const createServer = (httpServer, test) => {
  console.log("[ws] Client URI:", CLIENT_URI);
  return new Server(httpServer, {
    cors: {
      origin: test ? "*" : (CLIENT_URI || "http://localhost:3001"),
      methods: ["GET", "POST"]
    },
  });
}

/**
* @param {import("socket.io").Socket} socket
* @param {SOCKET_EVENTS[keyof SOCKET_EVENTS]} event
* @param {string} msg
*/
const emitSocket = (socket, event, msg) => {
  if (!(socket instanceof Socket)) throw new TypeError("Expected socket instance of Socket, got " + (typeof socket));
  if (typeof event !== "string") throw new TypeError("Expected event as string, got " + (typeof event));
  if (!event) throw new TypeError("event can't be empty");
  if (!msg) throw new TypeError("msg can't be empty");
  if (typeof msg !== "object") throw new TypeError("Expected msg as object, got " + (typeof msg));

  io.to(socket.id).emit(event, msg);
}

/**
* @param {SOCKET_EVENTS[keyof SOCKET_EVENTS]} event
* @param {string} msg
*/
const emitGlobal = (event, msg) => {
  for (const [id, socket] of userSockets) {
    emitSocket(socket, event, msg);
  }
}

const handleSocketError = (socket, err) => {
  console.log("[ws ERROR]", err);

  if (err && typeof err === "object"
    && (err.error === true || !isNaN(Number(err.status)))
    && err.message?.length) {
    return emitSocket(socket, SOCKET_EVENTS.ERROR, err);
  }

  // emitSocket(socket, SOCKET_EVENTS.ERROR, jString({
  //   error: true,
  //   message: "Internal Server Error",
  // }));
}

const userOnline = (user) => {
  user.dataValues.isOnline = true;
  console.log("[ws ONLINE]", user.id);
  emitGlobal(SOCKET_EVENTS.ONLINE, user);
};

const userOffline = (user) => {
  user.dataValues.isOnline = false;
  console.log("[ws OFFLINE]", user.id);
  emitGlobal(SOCKET_EVENTS.OFFLINE, user);
};

/**
* @param {import("socket.io").Socket} io
*/
const loadListeners = () => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    // console.log("TRIGGERED CONNECTION", socket);

    try {
      socket.on(SOCKET_EVENTS.IDENTIFY, (msg) => {
        console.log(msg, 'identify baru')
        try {
          const json = jParse(msg);
          const { userId } = json;
          const mapId = Number(userId);

          if (isNaN(mapId)) {
            throw {
              error: true,
              message: "Invalid userId",
            };
          }

          // save user socket for use
          userSockets.set(mapId, socket);
          console.log(userSockets.keys(), 'usersockets')
          console.log(userSockets.get(mapId).id, "socket id diri sendiri")
          io.to(userSockets.get(mapId).id).emit("yourID", userSockets.get(mapId).id);
          getUserWs(mapId).then(user => {
            userOnline(user);
            io.to(socket.id).emit(SOCKET_EVENTS.IDENTIFY, { ok: 1 });
          });
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        try {
          console.log("[ws DISCONNECT] Disconnected:", socket.id);
          let uId;
          for (const [id, usocket] of userSockets) {
            if (socket.id === usocket.id) {
              uId = id;
              break;
            }
          }

          if (uId) {
            socket.broadcast.emit("user left", { user_left: uId })
            userSockets.delete(uId);
            getUserWs(uId).then(user => userOffline(user));
          }
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.CLICK_CALL, (data) => {
        try {
          console.log(data)
          console.log(userSockets.keys())
          const userSocket = getUserSocket(data.userToCall);
          if (userSocket) {
            console.log(userSocket.id, "socket id yang mau di call")
            io.to(userSocket.id).emit(SOCKET_EVENTS.INCOMING_CALL, {
              from: data.from
            });
          }
          else throw {
            status: 400,
            message: "User is offline",
            data,
          };
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.CANCEL_CALL, (data) => {
        try {
          console.log("[ws CANCEL_CALL]", data);

          const userSocket = getUserSocket(data.userToCall);
          if (!userSocket) throw {
            status: 400,
            message: "User is offline",
          };

          io.to(userSocket.id).emit(SOCKET_EVENTS.CALL_IS_CANCELLED, {
            from: data.from
          });
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.DECLINE_CALL, (data) => {
        try {

          const userSocket = getUserSocket(data.userToDecline);
          if (!userSocket) throw {
            status: 400,
            message: "User is offline",
          };

          io.to(userSocket.id).emit(SOCKET_EVENTS.CALL_IS_DECLINED, {
            from: data.from
          });
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.LEAVE_CALL, (data) => {
        try {

          const userSocket = getUserSocket(data.userToInform);
          if (!userSocket) throw {
            status: 400,
            message: "User already left the call",
          };

          io.to(userSocket.id).emit(SOCKET_EVENTS.USER_LEAVES_THE_CALL, {
            from: data.from
          });
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.ACCEPT_VIDEO, (data) => {
        try {
          console.log(data, "acceptCall")
          const userSocket = getUserSocket(data.userToReceive);
          if (!userSocket) throw {
            status: 400,
            message: "User is offline",
          };

          io.to(userSocket.id).emit(SOCKET_EVENTS.CONFIRM_ACCEPT_VIDEO, {
            from: data.from
          });
          console.log(userSocket.id)
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.CALL, (data) => {
        try {
          console.log(data)
          const userSocket = getUserSocket(data.userToCall);
          if (!userSocket) throw {
            status: 400,
            message: "User is offline",
          };
          console.log(userSocket.id, "user id yg mau dicall", data.signalData, "signal yg dikirim caller")
          io.to(userSocket.id).emit(SOCKET_EVENTS.CALL_CONNECT, {
            signal: data.signalData,
            from: data.from,
          });
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.ACCEPT_CALL, (data) => {
        try {
          console.log("[ws ACCEPT_CALL]", data);
          const userSocket = getUserSocket(data.to);
          if (!userSocket) throw {
            status: 400,
            message: "User is offline",
          };
          io.to(userSocket.id).emit(SOCKET_EVENTS.CALL_ACCEPT, data.signal);
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.MESSAGE, async (message) => {
        try {
          console.log("[ws MESSAGE]", message);
          const data = await onMessage(message);

          data.newMessage.dataValues.User.dataValues.isOnline = isOnline(data.newMessage.dataValues.User.dataValues.id); // masih error tidak ada id di newMessage.User

          for (const gm of data.groupMembers) {
            gm.User.dataValues.isOnline = isOnline(gm.UserId);
          }

          sendMessage(data.groupMembers, data.newMessage);
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.MESSAGE_EDIT, async (message) => {
        try {
          console.log("[ws MESSAGE_EDIT]", message);
          const data = await onMessageEdit(message);

          data.message.User.dataValues.isOnline = isOnline(data.message.UserId);
          editMessage(data.groupMembers, data.message);
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

      socket.on(SOCKET_EVENTS.MESSAGE_DELETE, async (message) => {
        try {
          console.log("[ws MESSAGE_DELETE]", message);
          const data = await onMessageDelete(message);
          data.message.User.dataValues.isOnline = isOnline(data.message.User.id);

          deleteMessage(data.groupMembers, data.message);
        } catch (err) {
          handleSocketError(socket, err);
        }
      });

    } catch (err) {
      handleSocketError(socket, err);
    }
  });

  console.log("[ws] Loaded listeners");
}

// =========== PRIVATE FUNCTIONS END ===========

const isOnline = (userId) => {
  userId = validateUserId(userId);
  return !!userSockets.get(userId);
}

const init = (httpServer, testingMode) => {
  if (io) throw new Error("Socket already initialized");
  io = createServer(httpServer, testingMode);
  console.log("[ws] Init, instance created");
  loadListeners();
  return io;
}

/**
* @returns {import("socket.io").Socket}
*/
const getSocket = () => io;

const getUserSocket = (userId) => {
  return userSockets.get(userId);
}

/**
* @returns {Map<number, import("socket.io").Socket>}
*/
const getUserSockets = () => userSockets;

const distributeMessage = (groupMembers, data, event) => {
  if (!groupMembers) throw new TypeError("groupMembers can't be falsy");
  // if (!data) throw new TypeError("data can't be falsy");
  // const fromUserId = validateUserId(data.UserId);
  if (!Array.isArray(groupMembers)) throw new TypeError("Expected groupMembers as array, got " + groupMembers);

  for (const member of groupMembers) {
    if (!member) throw new TypeError("member can't be falsy");
    const memberId = validateUserId(member.UserId);
    // if (memberId === fromUserId) continue;

    const socket = userSockets.get(memberId);
    console.log("[ws distributeMessage]", memberId, socket?.id);
    if (socket) emitSocket(socket, event, jString(data));
  }
}

const distributeFriendship = (to, data, event) => {
  if (!to) throw new TypeError("to can't be falsy");
  if (!data) throw new TypeError("data can't be falsy");

  const toId = validateUserId(to.id);

  const socket = userSockets.get(toId);
  if (socket) emitSocket(socket, event, jString(data));
}

const sendMessage = (groupMembers, data) => {
  // io.emit(SOCKET_EVENTS.MESSAGE, { sendMessage: "ok" });
  return distributeMessage(groupMembers, data, SOCKET_EVENTS.MESSAGE);
};

const editMessage = (groupMembers, data) => {
  return distributeMessage(groupMembers, data, SOCKET_EVENTS.MESSAGE_EDIT);
};

const deleteMessage = (groupMembers, data) => {
  return distributeMessage(groupMembers, data, SOCKET_EVENTS.MESSAGE_DELETE);
};

const sendGroupUpdate = (groupMembers, data) => {
  return distributeMessage(groupMembers, data, SOCKET_EVENTS.GROUP_UPDATE);
};

const sendGroupJoin = (groupMembers, data) => {
  return distributeMessage(groupMembers, data, SOCKET_EVENTS.GROUP_JOIN);
};

const sendGroupLeave = (groupMembers, data) => {
  return distributeMessage(groupMembers, data, SOCKET_EVENTS.GROUP_LEAVE);
};

const sendFriendRequest = (to, data) => {
  return distributeFriendship(to, data, SOCKET_EVENTS.FRIEND_REQUEST);
}

const acceptedFriendRequest = (to, data) => {
  return distributeFriendship(to, data, SOCKET_EVENTS.FRIEND_REQUEST_ACCEPT);
}

const deletedFriendRequest = (to, data) => {
  return distributeFriendship(to, data, SOCKET_EVENTS.FRIEND_REQUEST_DELETE);
}

const sendUserUpdate = (user) => {
  emitGlobal(SOCKET_EVENTS.USER_UPDATE, user);
}

module.exports = {
  SOCKET_EVENTS,
  init,
  getSocket,
  getUserSockets,
  isOnline,
  getUserSocket,
  sendMessage,
  editMessage,
  deleteMessage,
  sendGroupJoin,
  sendGroupLeave,
  sendFriendRequest,
  acceptedFriendRequest,
  deletedFriendRequest,
  sendGroupUpdate,
  sendUserUpdate,
}

// vim: et sw=2 ts=8
