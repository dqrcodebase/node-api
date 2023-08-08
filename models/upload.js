const sequelize = require("./db");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define(
  "Upload",
  {
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isFinish: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    createdAt: false,
    updatedAt: false,
  }
)