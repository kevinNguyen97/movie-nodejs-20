"use strict";
const express = require("express");
const { scriptPassword } = require("../../services/auth");
const { createUser, getUserByEmail } = require("../../services/users");

const userRouter = express.Router();

userRouter.post("/sign-up", async (req, res) => {
  const { firstName, lastName, dayOfBirth, email, password, phoneNumber } =
    req.body;

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
    return res.status(500).send("can not create user");
  }

  res.status(201).send(data);
});

userRouter.post("sign-in", async (req, res) => {
  const { email, password } = req.body;

  // check valid data input

  //

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(400).send(`email: ${email} is not exist`);
  }
});

module.exports = userRouter;
