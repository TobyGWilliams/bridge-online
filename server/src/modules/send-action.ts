import WebSocket from "ws";

export default (socket: WebSocket, action: string, data: any) =>
  socket.send(JSON.stringify({ action, data }));
