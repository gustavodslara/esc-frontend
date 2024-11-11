const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('profile-pic'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  res.json({ filePath });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
