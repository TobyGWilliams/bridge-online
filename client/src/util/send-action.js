export default (socket, sessionId = undefined, action, data) =>
  socket.send(JSON.stringify({ action, data, sessionId }));
