'use strict';
const express = require('express');
const { SYSTEM } = require('../../config');
const { authenticate } = require('../../middlewares/auth');
const { uploadAvatar } = require('../../middlewares/upload');
const { scriptPassword, comparePassword, genToken } = require('../../services/auth');
const { createUser, getUserByEmail } = require('../../services/users');

const userRouter = express.Router();

userRouter.post('/sign-up', async (req, res) => {
  const { firstName, lastName, dayOfBirth, email, password, phoneNumber } = req.body;

  const passwordHashed = scriptPassword(password);
  console.log({ passwordHashed });

  const data = await createUser({
    firstName,
    lastName,
    dayOfBirth,
    email,
    password: passwordHashed,
    phoneNumber,
    role: 'USER',
  });

  if (!data) {
    return res.status(500).send('can not create user');
  }

  res.status(201).send(data);
});

userRouter.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  // check valid data input

  const user = await getUserByEmail(email);

  // check email is exist
  if (!user) {
    return res.status(400).send(`email: ${email} is not exist`);
  }

  const isSuccess = comparePassword(password, user.password);

  if (!isSuccess) {
    return res.status(400).send(`password is not match`);
  }

  const token = genToken({ id: user.id });

  return res.status(200).send({ user, token });
});

userRouter.post('/avatar', [authenticate, uploadAvatar()], async (req, res) => {
  const user = req.user;

  const file = req.file;

  const url = `${SYSTEM.DOMAIN}/${file.path}`;

  res.status(200).send('ok');
});

module.exports = userRouter;
