export default (socket, action, data) =>
  socket.send(JSON.stringify({ action, data }));
