'use strict';
const express = require('express');
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

module.exports = userRouter;
