module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      //모델 이름이 자동으로 mysql에서는 users로 저장됨
      // id: {} 는 기본적으로 mysql에서 다뤄준다!
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //이모티콘+한글저장
    }
  );

  Comment.associate = (db) => {
    
    
    db.Comment.belongsTo(db.User);
    
    db.Comment.belongsTo(db.Post);
  };

  return Comment;
};
