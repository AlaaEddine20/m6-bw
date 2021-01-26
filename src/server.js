const express = require("express");
require("dotenv").config();
const cors = require("cors");
const models = require("./utilities/db");
const {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} = require("./utilities/errorHandling");
// ROUTERS
const postRouter = require("./services/posts/index");
const userRouter = require("./services/users/index");
const experiencesRoute = require("./services/experiences/index");

const server = express();
const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());

// SERVER
server.use("/posts", postRouter);
server.use("/user", userRouter);
server.use("/experiences", experiencesRoute);
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

models.sequelize
  .sync({ force: false })

  .then((result) => {
    server.listen(port || 3001, () => console.log("Running on port " + port));
  })
  .catch((e) => console.log(e));
