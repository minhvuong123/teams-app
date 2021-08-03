const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath } = require('../../utils');
const fileSchema = require('../../models/file/file.model');

router.post('/', async function (req, res, next) {
  try {
    const { conversationId, files } = req.body.files;

    const populateFiles = files.map((file) => {
      return {
        name: file.name,
        base64: file.base64.split(";base64,")[1],
        type: file.type,
        uploadUrl: `${path.join(rootPath, 'public/files')}\\${file.name}`,
        dbUrl: `static/files/${file.name}`
      }
    })

    const uploadsRedult = [];

    for await (const [key, file] of populateFiles.entries()) {
      const result = new Promise((resolve, reject) => {
        require("fs").writeFile(file.uploadUrl, file.base64, 'base64', function (err) {
          if (!err) {
            resolve({ key, status: 'success' });         
          }
          reject({ key, status: 'fault' });
        });
      });
      
      uploadsRedult.push(await result);
    }

    // const fileModel = new fileSchema({ conversationId, sender: user, text });

    // const result = await fileModel.save();
    
    if (uploadsRedult.length > 0) {
      res.status(200).json({ result: uploadsRedult });
      return;
    } 
  
    res.status(404).json({ message: 'Information is error' });

  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({ message: 'Server error' })
  }
});

module.exports = router; 