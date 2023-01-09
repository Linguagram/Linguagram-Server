module.exports = (io, socket) => {
    const sendMessage = (payload) => {
      socket.emit("message:send", payload);
    };
  
    socket.on("message:send", sendMessage);
  };