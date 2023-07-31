const { async } = require("validate.js");
const Upload = require("../models/upload");
exports.uploadFile = async function (obj) {
  const ins = await Upload.create(obj);
  return ins.toJSON();
};
exports.checkUploadState = async function (hash) {
  const result = await Upload.findOne({ where: { hash } })
  const objResult = JSON.parse(JSON.stringify(result));
  return objResult
}
