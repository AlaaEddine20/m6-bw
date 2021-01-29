const express = require("express");

const cors = require("cors");
const models = require("./utilities/db");
const {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
  unauthorizedHandler,
} = require("./utilities/errorHandling");
// ROUTERS
const postRouter = require("./services/posts/index");
const userRouter = require("./services/users/index");
const authRouter = require("./services/auth/auth.js");
const experiencesRoute = require("./services/experiences/index");
const likesRouter = require("./services/likes/index");

const server = express();
const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());

// SERVER
server.use("/posts", postRouter);
server.use("/post/likes", likesRouter);
server.use("/user", userRouter);
server.use("/experiences", experiencesRoute);
server.use("/api/user", authRouter);
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
server.use(unauthorizedHandler);

models.sequelize
  .sync({ force: true })

  .then((result) => {
    server.listen(port || 3001, () => console.log("Running on port " + port));
  })
  .catch((e) => console.log(e));
