const { async } = require("validate.js");
const UploadChunk = require("../models/uploadChunk");
exports.uploadChunk = async function (obj) {
  const ins = await UploadChunk.create(obj);
  return ins;
};
exports.checkChunkUploadState = async function(hash) {
  const result = await UploadChunk.findAll({ where: { hash } })
  const objResult =  JSON.parse(JSON.stringify(result));
  return objResult 
}
exports.destroyChunk = async function (hash) {
  const result = await UploadChunk.destroy({ where: { hash } })
  const objResult = JSON.parse(JSON.stringify(result));
  return objResult
}

