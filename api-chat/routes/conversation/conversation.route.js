const express = require('express');
const router = express.Router();
const conversationSchema = require('../../models/conversation/conversation.model');
const userSchema = require('../../models/user/user.model');
const mongoose = require('mongoose');

router.get('/user/:id', async function (req, res) {
  try {
    const { id } = req.params;

    const conversation = await conversationSchema.where({"members._id": {"$in": [mongoose.Types.ObjectId(id)] }})
                                .select(`
                                  _id 
                                  name 
                                  members._id
                                  members.user_firstname
                                  members.user_lastname
                                  members.user_fullname
                                  members.user_avatar
                                  members.user_email
                                  members.user_phone
                                  members.user_background_color
                                  members.createdAt
                                  createdAt
                                `);

    if (conversation) {
      res.status(200).json({ conversation: conversation || [] });
      return;
    } 

    res.status(404).json({ message: 'Information is error' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
});

router.get('/user/:id', async function (req, res) {
  try {
    const { id } = req.params;

    const conversation = await conversationSchema.where({"members._id": {"$in": [mongoose.Types.ObjectId(id)] }})
                                .select(`
                                  _id 
                                  name 
                                  members._id
                                  members.user_firstname
                                  members.user_lastname
                                  members.user_fullname
                                  members.user_avatar
                                  members.user_email
                                  members.user_phone
                                  members.user_background_color
                                  members.createdAt
                                  createdAt
                                `);

    if (conversation) {
      res.status(200).json({ conversation: conversation || [] });
      return;
    } 

    res.status(404).json({ message: 'Information is error' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
});

router.post('/create', async function (req, res) {
  try {
    const { members } = req.body.conversation;

    // get data from array condition
    const users = await userSchema.where({ _id: {'$in': members }});

    // {"members.user_role": {"$in": ["normal"] }}
    const conversation = await conversationSchema.find({members: users});

    if (Object.keys(conversation || {}).length > 0) {
      res.status(200).json({ status: 'exist', conversationId: conversation.id});
      return;
    }
    
    if (users.length > 0) {
      const conversationModel = new conversationSchema({ members: users });

      const result = await conversationModel.save();

      if (Object.keys(result).length > 0) {
        res.status(200).json({ status: 'success' });
        return;
      } 
    }

    res.status(404).json({ message: 'Information is error' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
});

module.exports = router; 