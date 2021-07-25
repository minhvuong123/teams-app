const express = require('express');
const router = express.Router();
const messageSchema = require('../../models/message/message.model');

router.get('/:id', async function (req, res) {
  try {
    const { id } = req.params;

    const messages = await messageSchema.find({ conversationId: id });

    if (messages) {
      res.status(200).json({ messages });
      return;
    } 

    res.status(404).json({ message: 'Information is error' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
});

router.post('/', async function (req, res) {
  try {
  
    const { conversationId, senderId, text } = req.body.message;

    const messageModel = await messageSchema({ conversationId, senderId, text });

    const result = await messageModel.save();

    if (Object.keys(result).length > 0) {
      res.status(200).json({ status: 'success' });
      return;
    } 

    res.status(404).json({ message: 'Information is error' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
});

module.exports = router; 