const { async } = require("validate.js");
const uploadChunk = require("../models/uploadChunk");
exports.uploadChunk = async function (obj) {
  const ins = await uploadChunk.create(obj);
  return ins;
};
exports.checkChunkUploadState = async function(hash) {
  const result = await uploadChunk.findAll({ where: { hash } })
  const objResult =  JSON.parse(JSON.stringify(result));
  return objResult 
}
