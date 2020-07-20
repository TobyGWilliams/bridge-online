module.exports = (socket, action, data) =>
  socket.send(JSON.stringify({ action, data }));
