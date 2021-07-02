const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Image extends Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: "Image",
        tableName: "images",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Image.belongsTo(db.Post);
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Image = sequelize.define(
//     "Image",
//     {
//       //모델 이름이 자동으로 mysql에서는 users로 저장됨
//       // id: {} 는 기본적으로 mysql에서 다뤄준다!
//       src: {
//         type: DataTypes.STRING(200),
//         allowNull: false,
//       },
//     },
//     {
//       charset: "utf8",
//       collate: "utf8_general_ci", //이모티콘+한글저장
//     }
//   );

//   Image.associate = (db) => {
//     db.Image.belongsTo(db.Post);
//   };

//   return Image;
// };
