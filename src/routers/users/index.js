"use strict";
const express = require("express");
const { scriptPassword } = require("../../services/auth");
const { createUser } = require("../../services/users");

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

module.exports = userRouter;
