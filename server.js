const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname)));

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Tipo de archivo no permitido'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
}).array('files', 5); 

app.post('/upload', (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        const fileDetails = req.files.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
        }));
        res.json(fileDetails);
      }
    });
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
