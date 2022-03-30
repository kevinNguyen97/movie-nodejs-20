"use strict";
const express = require("express");
const { sequelize } = require("./models");

const rootRouter = require("./src/routers");

const app = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const port = 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});