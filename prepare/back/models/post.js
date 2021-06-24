module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      //모델 이름이 자동으로 mysql에서는 users로 저장됨
      // id: {} 는 기본적으로 mysql에서 다뤄준다!
      content: {
        type: DataTypes.TEXT, //무제한
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //이모티콘+한글저장
    }
  );

  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
    db.Post.belongsTo(db.Post, { as: "Retweet" }); //RetweetId 생김!
  };

  return Post;
};
