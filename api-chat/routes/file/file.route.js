const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath } = require('../../utils');
const fileSchema = require('../../models/file/file.model');

router.get('/:conversationId', async function (req, res, next) {
  try {
    const { conversationId } = req.params;
    
    const files = await fileSchema.where({ conversationId });

    res.status(200).json({ files: files });

  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({ message: 'Server error' })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { conversationId, files } = req.body.files;

    const populateFiles = files.map((file) => {
      return {
        id: file.id,
        name: file.name,
        base64: file.base64.split(";base64,")[1],
        type: file.type,
        size: file.size,
        uploadUrl: `${path.join(rootPath, 'public/files')}\\${file.name}`,
        dbUrl: `static/files/${file.name}`
      }
    })

    const uploadsRedult = [];

    for await (const file of populateFiles) {
      const result = new Promise((resolve, reject) => {
        require("fs").writeFile(file.uploadUrl, file.base64, 'base64', function (err) {
          if (!err) {
            resolve({ id: file.id, status: true, name: file.name, type: file.type, size: file.size, url: file.dbUrl });         
          }
          reject({ id: file.id, status: false });
        });
      });
      
      uploadsRedult.push(await result);
    }

    const uploadFault = uploadsRedult.some(u => !u.status);

    if (uploadFault) {
      res.status(404).json({ file: 'upload is fault' });
      return;
    }

    const populateFileSave = uploadsRedult.map(file => {
      return {
        conversationId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url
      }
    });

    for (const [key, file] of populateFileSave.entries()) {
      const fileModel = new fileSchema(file);
      const result = await fileModel.save();

      if (!result || !result.conversationId) {
        uploadsRedult[key].status = false;
      }
    }
    
    res.status(200).json({ files: uploadsRedult });

  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({ message: 'Server error' })
  }
});

module.exports = router; 