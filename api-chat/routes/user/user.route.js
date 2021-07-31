const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { rootPath, configToken } = require('../../utils');
const { v1: uuid } = require('uuid');
const { TinyColor } = require('@ctrl/tinycolor');
const { random } = require('@ctrl/tinycolor');
const userSchema = require('../../models/user/user.model');
const refreshTokenSchema = require('../../models/refreshToken/refreshToken.model');

router.get('/', async function (req, res) {
  try {
    const users = await userSchema.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:page/:limit', async function (req, res) {
  try {
    const page = +req.params.page - 1 || 0;
    const limit = +req.params.limit || 10;
    const users = await userSchema.find().skip(page * limit).limit(limit);
    const count = await userSchema.countDocuments();

    res.status(200).json({ users, count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/filter', async function (req, res) {
  try {
    const stringText = req.body.value;

    const searchObject = {
      '$or': [
        { user_firstname: {  $regex: '.*' + stringText + '.*', $options: 'i' } },
        { user_lastname: {  $regex: '.*' + stringText + '.*', $options: 'i' } },
        { user_fullname: {  $regex: '.*' + stringText + '.*', $options: 'i' } },
        { user_email: { $regex: '.*' + stringText + '.*', $options: 'i' } }
      ]
    }
    const users = await userSchema.where(searchObject);
    const usersResult = users.map(user => {
      return {
        _id: user._id,
        user_fullname: user.user_fullname,
        user_avatar: user.user_avatar,
        user_email: user.user_email
      }
    });

    res.status(200).json({
      users: usersResult || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})


router.post('/', async function (req, res) {
  try {
    const base64Data = req.body.user.user_image_base64.split(";base64,")[1];
    const exten = req.body.typeImage;
    const imageName = uuid();
    const saveUrl = `${path.join(rootPath, 'public/images')}\\${imageName}.${exten}`;
    req.body.user.image_url = base64Data ? `static/images/${imageName}.${exten}` : '';

    const { 
      user_email,
      user_phone,
      user_password,
      user_role
    } = req.body.user;

    if (base64Data) {
      require("fs").writeFile(saveUrl, base64Data, 'base64', async function (err) {
        if (!err) {
          const user = new userSchema({ user_email, user_phone, user_password, user_role });
          const result = await user.save();
          
          res.status(200).json({  user: result });
        }
      });
    } else {
      const user = new userSchema({ user_email, user_phone, user_password, user_role });

      const result = await user.save();
      res.status(200).json({ user: result });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})


router.patch('/', async function (req, res) {
  try {
    if (req.body.user.user_image_base64) {
      const base64Data = req.body.user.user_image_base64.split(";base64,")[1];
      const exten = req.body.typeImage;
      const imageName = uuid();
      const saveUrl = `${path.join(rootPath, 'public/images')}\\${imageName}.${exten}`;
      req.body.user.image_url = `static/images/${imageName}.${exten}`;

      delete req.body.user.user_image_base64;
      delete req.body.user.status;

      require("fs").writeFile(saveUrl, base64Data, 'base64', async function (err) {
        if (!err) {
          const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user })
          if (user.ok === 1) {
            res.status(200).json({ status: 'ok', image_url: req.body.user.image_url });
          }
        }
      });
    } else {
      const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user });

      if (user.ok === 1) {
        res.status(200).json({ status: 'ok',  image_url: req.body.user.image_url });
      }
    }

  } catch (error) {
    res.status(500).json({ status: 'Server error' });
  }
})

router.post('/register', async function (req, res) {
  try {
    const { user_firstname, user_lastname, user_email, user_phone } = req.body.user;
    const user_fullname = `${user_lastname} ${user_firstname}`;
    const user_password = bcrypt.hashSync(req.body.user.user_password, 10);
    let color = new TinyColor(random().originalInput);

    while (color.isLight()) {
      color = new TinyColor(random().originalInput);
    }

    const user = new userSchema({ user_firstname, user_lastname, user_fullname, user_email, user_phone, user_password, user_background_color: `#${color.toHex()}` });

    const result = await user.save();

    if (Object.keys(result).length > 0) {
      res.status(200).json({ status: 'success' });
    } else {
      res.status(404).json({ message: 'Information is error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/sign-in', async function (req, res, next) {
  try {
    const user_email = req.body.user.user_email;
    const user_password = req.body.user.user_password;

    const user = await userSchema.where({ user_email }).findOne();

    if (Object.keys(user).length > 0) {
      const match = await bcrypt.compare(user_password, user.user_password);
      if (match) {
        const userPopulate = {
          _id: user._id,
          user_name: user.user_name,
          user_avatar: user.user_avatar,
          user_role: user.user_role,
          user_email: user.user_email,
          user_phone: user.user_phone,      
          createdAt: user.createdAt
        };

        const token = jwt.sign({...userPopulate}, configToken.secretToken, { expiresIn: configToken.tokenLife });
        const refreshTokenExist = await refreshTokenSchema.findOne({user_id: user._id});

        if (!refreshTokenExist || Object.keys(refreshTokenExist) <= 0) {
          refreshToken = jwt.sign({...userPopulate}, configToken.refreshTokenSecret);

          // save refresh token into db
          const refreshTokenModel = new refreshTokenSchema({ user_id: user._id, token: refreshToken });
          await refreshTokenModel.save();
        }
        
        res.status(200).json({  status: 'success', token });
        return;
      }
      
      res.status(404).json({ status: 'fault' });
      return;
    }
    res.status(404).json({ status: 'User is not found !' });
    return;

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
})


router.post('/delete', async function (req, res) {
  try {
    const _id = req.body.user._id;
    const result = await userSchema.deleteOne({ _id });

    if (result.deletedCount >= 1) {
      res.status(200).json({ status: 'ok' });
      return;
    }

    res.status(404).json({ status: 'fault' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'server error' })
  }
})

module.exports = router; 