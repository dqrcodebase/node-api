const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { asyncHandler } = require("../getSendResult");
const uploadChunkServ = require("../../services/uploadChunkService.js");
const uploadService = require("../../services/uploadService.js");

const uploadPath = path.join(__dirname, '../../public/uploads');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    console.log("🚀 ~ file: uploadChunk.js:18 ~ file:", file)
    cb(null, '33333333');
  },
});

const upload = multer({
  storage,
});



router.get('/inspect/:hash', asyncHandler(async (ctx, next) => {
  const hash = ctx.params.hash
  const filename = `${uploadPath}/${hash}`
  const result = await uploadService.checkUploadState(hash);
  if(result) {
    return false
  }else {
    const res = await uploadChunkServ.checkChunkUploadState(hash);
    if(res.length === 0) {
      return false
    }else {
      return res
    }
  }
})
)

router.post("/", upload.single("chunk"), asyncHandler(async (ctx, next) => {
  const {
    hash,
    chunkHash
  } = ctx.body;
  console.log('====================================');
  console.log(chunkHash);
  console.log('====================================');
  return await uploadChunkServ.uploadChunk(ctx.body);
}));


module.exports = router;
