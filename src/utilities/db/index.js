const { Sequelize, DataTypes } = require("sequelize");
const Post = require("./Post");
// const Like = require("./Likes");
const User = require("./user");
const Experience = require("./experiences");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
port: process.env.PGPORT,
    dialect: "postgres",

  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established"))
  .catch((e) => console.log("Unable to establish connection:", e));

//
const models = {
  Post: Post(sequelize, DataTypes),
  // Like: Like(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
  Experience: Experience(sequelize, DataTypes),
};


// force sequelize to create associations
Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

// Sync models
models.sequelize = sequelize;
// Include all configurations
models.Sequelize = Sequelize;

module.exports = models;
