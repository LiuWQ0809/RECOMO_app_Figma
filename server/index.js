const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for temporary storage
const upload = multer({ dest: 'uploads/' });

// Local storage configuration (data resides on this machine)
const STORAGE_BASE_PATH =
  process.env.STORAGE_BASE_PATH || '/home/converge/data/RECOMO_App_Data';

app.post(
  '/upload',
  upload.fields([{ name: 'video' }, { name: 'data' }]),
  async (req, res) => {
    try {
      const dateFolder = new Date().toISOString().split('T')[0];
      const targetDir = path.join(STORAGE_BASE_PATH, dateFolder);
      fs.mkdirSync(targetDir, { recursive: true });

      const results = [];

      if (req.files['video']) {
        const videoFile = req.files['video'][0];
        const targetPath = path.join(targetDir, videoFile.originalname);
        console.log(`Saving video to ${targetPath}`);
        fs.renameSync(videoFile.path, targetPath);
        results.push({ type: 'video', path: targetPath });
      }

      if (req.files['data']) {
        const dataFile = req.files['data'][0];
        const targetPath = path.join(targetDir, dataFile.originalname);
        console.log(`Saving data to ${targetPath}`);
        fs.renameSync(dataFile.path, targetPath);
        results.push({ type: 'data', path: targetPath });
      }

      console.log('Upload complete.');
      res.json({
        success: true,
        message: 'Files uploaded successfully',
        files: results,
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Saving uploads to ${STORAGE_BASE_PATH}`);
});
