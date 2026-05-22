import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import type { ClientToServerEvents, ServerToClientEvents } from '../shared/game';
import { createRoom, getRoomSnapshot, joinRoom, registerSocket, resumeRoom, startGame, submitCanvas, unregisterSocket } from './roomStore';

const app = express();
const httpServer = createServer(app);

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : true;

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: corsOrigin, credentials: true },
});

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

io.on('connection', (socket) => {
  socket.on('createRoom', (payload, ack) => {
    const result = createRoom(payload.name);
    if ('error' in result) {
      ack(result);
      return;
    }

    socket.join(result.room.code);
    registerSocket(result.room.code, result.playerId, socket.id);
    ack(result);
    const snapshot = getRoomSnapshot(result.room.code);
    if (snapshot) {
      io.to(result.room.code).emit('roomUpdated', snapshot);
    }
  });

  socket.on('joinRoom', (payload, ack) => {
    const result = joinRoom(payload.code, payload.name, payload.playerId);
    if ('error' in result) {
      ack(result);
      return;
    }

    socket.join(result.room.code);
    registerSocket(result.room.code, result.playerId, socket.id);
    ack(result);
    const snapshot = getRoomSnapshot(result.room.code);
    if (snapshot) {
      io.to(result.room.code).emit('roomUpdated', snapshot);
    }
  });

  socket.on('resumeRoom', (payload, ack) => {
    const result = resumeRoom(payload.code, payload.playerId);
    if ('error' in result) {
      ack(result);
      return;
    }

    socket.join(payload.code.toUpperCase());
    registerSocket(payload.code.toUpperCase(), payload.playerId, socket.id);
    ack(result);
    const snapshot = getRoomSnapshot(payload.code);
    if (snapshot) {
      io.to(payload.code.toUpperCase()).emit('roomUpdated', snapshot);
    }
  });

  socket.on('startGame', async (payload, ack) => {
    const result = await startGame(payload.code, payload.playerId, io);
    ack?.(result);
  });

  socket.on('submitCanvas', (payload, ack) => {
    const result = submitCanvas(payload.code, payload.playerId, payload.dataUrl, payload.submittedAt, io);
    ack?.(result);
  });

  socket.on('disconnect', () => {
    unregisterSocket(socket.id);
  });
});

const port = 3001;

httpServer.listen(port, () => {
  console.log(`GoPaint server listening on http://localhost:${port}`);
});