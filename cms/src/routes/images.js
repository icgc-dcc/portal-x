import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { Readable } from 'stream';

export const imagesRouter = express.Router();

const conn = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
  {
    useNewUrlParser: true,
  },
);
let bucket;
conn.once('open', function() {
  bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });
  console.log('GridFSBucket is ready for uploads');
});

imagesRouter.post('/', async (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage, limits: { fields: 1, files: 1, parts: 2 } });
  upload.single('image')(req, res, err => {
    if (err) {
      return res.status(500).json({ error: 'upload request failed' });
    }
    const filename = req.body.filename;
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null); // push null to mark data end

    let uploadStream = bucket.openUploadStream(filename);
    readableStream.pipe(uploadStream);

    uploadStream
      .on('error', () => {
        return res.status(500).json({ error: 'Error uploading file' });
      })
      .on('finish', () => {
        return res.status(201).json({ id: uploadStream.id, filename });
      });
  });
});

imagesRouter.get('/:id', async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const imageId = new ObjectId(req.params.id);

    res.set('accept-ranges', 'bytes');

    bucket
      .openDownloadStream(imageId)
      .on('data', chunk => {
        res.write(chunk);
      })
      .on('error', () => {
        res.status(404).json({ error: `cant delete, file with id ${req.params.id} not found` });
      })
      .on('end', () => {
        res.end();
      });
  } catch (err) {
    return res.status(400).json({ error: 'invalid id' });
  }
});

imagesRouter.delete('/:id', async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const imageId = new ObjectId(req.params.id);

    try {
      await bucket.delete(imageId);
      res.status(200).json({ success: `image with id ${id} deleted` });
    } catch (e) {
      res.status(500).json({ error: `error removing image with id ${id}` });
    }
  } catch (err) {
    return res.status(400).json({ error: `image with id ${id} not found` });
  }
});
