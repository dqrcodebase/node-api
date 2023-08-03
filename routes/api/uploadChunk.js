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
    const {hash} = req.headers
    const destinationPath = `${uploadPath}/${hash}`

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const {chunkhash} = req.headers
    cb(null, `${chunkhash}`);
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
    return true
  }else {
    const res = await uploadChunkServ.checkChunkUploadState(hash);
    if(res.length === 0) {
      const res = await fs.promises.mkdir(filename)
      return false
    }else {
      return res
    }
  }
})
)

router.post("/", upload.single("chunk"), asyncHandler(async (ctx, next) => {
  const {
    chunkHash
  } = ctx.body;
  return await uploadChunkServ.uploadChunk(ctx.body);
}));

router.get('/finish',asyncHandler(async (ctx,next) => {

}))


module.exports = router;
