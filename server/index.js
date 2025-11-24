const express = require('express');
const multer = require('multer');
const Client = require('ssh2-sftp-client');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for temporary storage
const upload = multer({ dest: 'uploads/' });

// SFTP Configuration
const sftpConfig = {
  host: '192.168.100.100',
  port: 22,
  username: 'converge',
  password: 'converge2025'
};

const REMOTE_BASE_PATH = '/home/converge/data/RECOMO_App_Data';

app.post('/upload', upload.fields([{ name: 'video' }, { name: 'data' }]), async (req, res) => {
  const sftp = new Client();
  try {
    console.log('Connecting to SFTP server...');
    await sftp.connect(sftpConfig);
    console.log('Connected.');

    // Ensure remote directory exists
    const exists = await sftp.exists(REMOTE_BASE_PATH);
    if (!exists) {
        console.log(`Creating remote directory: ${REMOTE_BASE_PATH}`);
        await sftp.mkdir(REMOTE_BASE_PATH, true);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // Create a subdirectory for this session (optional, but good for organization)
    // For now, following the prompt strictly: "save to .../RECOMO_App_Data"
    // I will save directly there or create a subfolder if needed. 
    // The prompt says "can create subdirectories as needed".
    // Let's create a subfolder based on date to avoid clutter.
    const dateFolder = new Date().toISOString().split('T')[0];
    const targetDir = `${REMOTE_BASE_PATH}/${dateFolder}`;
    
    const dirExists = await sftp.exists(targetDir);
    if (!dirExists) {
        await sftp.mkdir(targetDir, true);
    }

    const results = [];

    if (req.files['video']) {
      const videoFile = req.files['video'][0];
      const remoteVideoPath = `${targetDir}/${videoFile.originalname}`;
      console.log(`Uploading video to ${remoteVideoPath}`);
      await sftp.put(videoFile.path, remoteVideoPath);
      fs.unlinkSync(videoFile.path); // Clean up local file
      results.push({ type: 'video', path: remoteVideoPath });
    }

    if (req.files['data']) {
      const dataFile = req.files['data'][0];
      const remoteDataPath = `${targetDir}/${dataFile.originalname}`;
      console.log(`Uploading data to ${remoteDataPath}`);
      await sftp.put(dataFile.path, remoteDataPath);
      fs.unlinkSync(dataFile.path); // Clean up local file
      results.push({ type: 'data', path: remoteDataPath });
    }

    await sftp.end();
    console.log('Upload complete.');
    res.json({ success: true, message: 'Files uploaded successfully', files: results });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
