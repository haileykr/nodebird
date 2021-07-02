const DataTypes =require("sequelize");
const { Model} = DataTypes;

module.exports = class Hashtag extends Model{ 
  static init(sequelize){
    return super.init({
      //모델 이름이 자동으로 mysql에서는 users로 저장됨
      // id: {} 는 기본적으로 mysql에서 다뤄준다!
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
      modelName: 'Hashtag',
      tableName: 'hashtags',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    })
  }
  static associate(db){ 
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define(
//     "Hashtag",
//     {
//       //모델 이름이 자동으로 mysql에서는 users로 저장됨
//       // id: {} 는 기본적으로 mysql에서 다뤄준다!
//       name: {
//         type: DataTypes.STRING(20),
//         allowNull: false,
//       },
//     },
//     {
//       charset: "utf8mb4",
//       collate: "utf8mb4_general_ci", //이모티콘+한글저장
//     }
//   );

//   Hashtag.associate = (db) => {
//     db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
//   };

//   return Hashtag;
// };
