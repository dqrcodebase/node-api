const sequelize = require("./db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define(
  "UploadChunk",
  {
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chunkHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    paranoid: true,
  }
)