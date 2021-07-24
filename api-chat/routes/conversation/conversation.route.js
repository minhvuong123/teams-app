const express = require('express');
const router = express.Router();
const { rootPath } = require('../../utils');
const { v1: uuid } = require('uuid');
const conversationSchema = require('../../models/conversation/conversation.model');


module.exports = router; 