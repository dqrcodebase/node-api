const sequelize = require("./db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define(
  "Upload",
  {
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chunkHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    finish: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    createdAt: false,
    updatedAt: false,
    paranoid: true,
  }
)