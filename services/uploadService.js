const { async } = require('validate.js')
const Upload = require('../models/upload')
const sequelize = require("../models/db");
const { QueryTypes } = require('sequelize');
// We didn't need to destructure the result here - the results were returned directly

exports.getUploadFile = async function (hash, isFinish) {
  const result = await Upload.findOne({ where: { hash, isFinish } });
  return JSON.parse(JSON.stringify(result))
}
exports.createFileInfo = async function (params) {
  const ins = await Upload.create(params)
  return ins.toJSON()
}
exports.uploadFinish = async function (hash) {
  const result = await Upload.update({ isFinish: true }, { where: { hash } });
  return JSON.parse(JSON.stringify(result))
}
exports.destroyFile = async function (hash) {
  const result = await Upload.destroy({ where: { hash } })
  return JSON.parse(JSON.stringify(result))
}
