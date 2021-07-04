const Sequelize = require("sequelize");

// latest syntax
const hashtag = require("./hashtag");
const comment = require("./comment");
const image = require("./image");
const post = require("./post");
const user = require("./user");

const env = process.env.NODE_ENV || "development";
// const config = require("../config/config")[env];
const config = require("../config/config")["development"];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// db.Comment = require("./comment")(sequelize, Sequelize);
// db.Hashtag = require("./hashtag")(sequelize, Sequelize);
// db.Image = require("./image")(sequelize, Sequelize);
// db.Post = require("./post")(sequelize, Sequelize);
// db.User = require("./user")(sequelize, Sequelize);

// latest syntax
db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

// latest syntax
Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
