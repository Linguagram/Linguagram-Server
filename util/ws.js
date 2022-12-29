"use strict";

// STRICT MODE HERE

const { Server, Socket } = require("socket.io");
const { GroupMember } = require("../models");
const { wsValidator } = require("./validators");
const { CLIENT_URI } = process.env;

const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  IDENTIFY: "identify",
  ERROR: "error",

  MESSAGE: "message",
  // MESSAGE_EDIT: "message_edit",
  MESSAGE_DELETE: "message_delete",
  STATUS: "status",
  USER_UPDATE: "user_update",
  GROUP_CREATE: "group_create",
  GROUP_JOIN: "group_join",
  GROUP_LEAVE: "group_leave",
  GROUP_DELETE: "group_delete",
  FRIEND_REQUEST: "friend_request",
  FRIEND_REQUEST_CANCEL: "friend_request_cancel",
  FRIEND_REQUEST_ACCEPT: "friend_request_accept",
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
  return JSON.stringify(object);
}

const jParse = (str) => {
  return JSON.parse(str);
}

const validateUserId = (userId) => {
  return wsValidator("number", userId, "Expected userId to be number, got " + userId);
}

const createServer = (httpServer) => {
  return new Server(httpServer, {
    cors: {
      origin: CLIENT_URI || "http://localhost:5173",
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
  if (typeof msg !== "string") throw new TypeError("Expected msg as string, got " + (typeof msg));
  if (!event) throw new TypeError("event can't be empty");
  if (!msg) throw new TypeError("msg can't be empty");

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

/**
 * @param {import("socket.io").Socket} io
 */
const loadListeners = () => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    socket.on(SOCKET_EVENTS.IDENTIFY, (msg) => {

      console.log(msg);

      try {
	const json = jParse(msg);
	const { userId } = json;
	const mapId = Number(userId);

	if (isNaN(mapId)) {
	  emitSocket(socket, SOCKET_EVENTS.ERROR, jString({
	    error: true,
	    message: "Invalid userId",
	  }));
	}

	// save user socket for use
	userSockets.set(mapId, socket);
      } catch (err) {
	console.error("[IDENTIFY ERROR]", err);

	emitSocket(socket, SOCKET_EVENTS.ERROR, jString({
	  error: true,
	  message: "Internal Server Error",
	}));
      }
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      let uId;
      for (const [id, usocket] of userSockets) {
	if (socket.id === usocket.id) {
	  uId = id;
	  break;
	}
      }

      if (uId) userSockets.delete(uId);
    });
  });
}

// =========== PRIVATE FUNCTIONS END ===========

const isOnline = (userId) => {
  userId = validateUserId(userId);
  return userSockets.get(userId);
}

const init = (httpServer) => {
  if (io) throw new Error("Socket already initialized");
  io = createServer(httpServer);
  loadListeners();
}

/**
 * @returns {import("socket.io").Socket}
 */
const getSocket = () => io;

const getUserSocket = (userId) => {
  userId = validateUserId(userId);
  return userSockets.get(userId);
}

/**
 * @returns {Map<number, import("socket.io").Socket>}
 */
const getUserSockets = () => userSockets;

const sendMessage = (groupMembers, data) => {
  if (!groupMembers) throw new TypeError("groupMembers can't be falsy");
  if (!data) throw new TypeError("data can't be falsy");
  const fromUserId = validateUserId(data.UserId);
  if (!Array.isArray(groupMembers)) throw new TypeError("Expected groupMembers as array, got " + groupMembers);

  for (const member of groupMembers) {
    if (!member) throw new TypeError("member can't be falsy");
    const memberId = validateUserId(member.UserId);
    if (memberId === fromUserId) continue;

    const socket = userSockets.get(memberId);
    if (socket) emitSocket(socket, SOCKET_EVENTS.MESSAGE, jString(data));
  }
};

module.exports = {
  SOCKET_EVENTS,
  init,
  getSocket,
  getUserSockets,
  isOnline,
  getUserSocket,
  sendMessage,
}
