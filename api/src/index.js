import 'babel-polyfill';
import express from 'express';
import socketIO from 'socket.io';
import { Server } from 'http';
import Arranger from '@arranger/server';
import cors from 'cors';

const port = process.env.PORT || 5050;
const app = express();
const http = Server(app);
const io = socketIO(http);
app.use(cors());

Arranger({
  io,
}).then(router => {
  app.use(router);

  http.listen(port, async () => {
    console.log(`⚡️ Listening on port ${port} ⚡️`);
  });
});
