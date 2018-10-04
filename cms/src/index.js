// @ts-check

import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import restify from 'express-restify-mongoose';
import morgan from 'morgan';

import { data_sync_router } from './routes/sync-data';
import { imagesRouter, bulkRouter, actionRouter } from './routes';
import { preUpdate, validateYup, preModelDelete, postUpdate } from './hooks';
import Model from './schemas/model';
import User from './schemas/user';
import { validateUserRequest } from './validation/user';
import isUserAuthorized from './helpers/authorizeUserAccess';

const port = process.env.PORT || 8080;
const app = express();
const modelRouter = express.Router();
const userRouter = express.Router();

// Handle "unhandled" promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
  console.log('------------------------------------------------');
  console.log('For promise:', promise);
});

// Ensures uniques actually work
// (default results in log: mongoose collection.ensureIndex is deprecated. Use createIndexes)
mongoose.set('useCreateIndex', true);

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
});

// configure server
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// configure logging
app.use(morgan('combined'));

if (process.env.AUTH_ENABLED) {
  app.use((req, res, next) => {
    if (!isUserAuthorized(req)) {
      return res.status(403).json({
        error: `${req.headers['USER_EMAIL'] || ''} is not authorized to access this application.`,
      });
    }
    next();
  });
}

// configure endpoints
restify.serve(modelRouter, Model, {
  preCreate: validateYup,
  preUpdate,
  postUpdate: postUpdate,
  preDelete: preModelDelete,
  idProperty: 'name',
});

// configure endpoints
restify.serve(userRouter, User, {
  preCreate: validateUserRequest,
  preUpdate: validateUserRequest,
});

// get logged in user info
app.get('api/vi/loggedInUser', (req, res) => {
  res.json({ user_email: req.headers['USER_EMAIL'] || '' });
});

app.use('/api/v1', data_sync_router);
app.use('/api/v1/bulk', bulkRouter);
app.use('/api/v1/images', imagesRouter);
app.use('/api/v1/action', actionRouter);
app.use(modelRouter);
app.use(userRouter);

// start app
const http = new Server(app);
http.listen(port, async () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
