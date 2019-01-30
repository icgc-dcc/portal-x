import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import Arranger from '@arranger/server';
import cors from 'cors';
import lastUpdatedRouter from './lastUpdated';
import dataExportRouter from './dataExport';
import cmsDataRouter from './cmsData';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import expressSanitizer from 'express-sanitizer';
import * as path from 'path';

const port = process.env.PORT || 5050;
const app = express();
const http = Server(app);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); // each route is responsible for sanitization
app.use(cors());

//swagger
app.use('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../redoc.html'));
});
app.use('/swagger', (req, res) => {
  res.sendFile(path.join(__dirname, '../swagger.json'));
});

app.use('/data', cmsDataRouter);

Arranger({ enableAdmin: process.env.ENABLE_ADMIN === 'true' }).then(router => {
  app.use('/last-updated', lastUpdatedRouter);
  app.use('/export', dataExportRouter);
  app.use(router);

  http.listen(port, async () => {
    console.log(`⚡️ Listening on port ${port} ⚡️`);
  });
});
