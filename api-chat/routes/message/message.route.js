const express = require('express');
const router = express.Router();
const { rootPath } = require('../../utils');
const { v1: uuid } = require('uuid');
const messageSchema = require('../../models/message/message.model');

module.exports = router; 