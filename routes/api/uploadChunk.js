const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { asyncHandler } = require('../getSendResult')
const uploadChunkServ = require('../../services/uploadChunkService.js')
const uploadService = require('../../services/uploadService.js')
const uploadChunkPath = path.join(__dirname, '../../public/uploads/chunk')
const uploadFilesPath = path.join(__dirname, '../../public/uploads/files')

const fs = require('fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { hash } = req.headers
    const destinationPath = `${uploadChunkPath}/${hash}`

    cb(null, destinationPath)
  },
  filename: function (req, file, cb) {
    const { chunkhash } = req.headers
    cb(null, `${chunkhash}`)
  },
})

const upload = multer({
  storage,
})

// 校验文件是否存在服务器中
router.post(
  '/inspect/:hash',
  asyncHandler(async (ctx, next) => {
    const { hash, size, type, name } = ctx.body
    const filename = `${uploadChunkPath}/${hash}`
    const result = await uploadService.getUploadFile(hash,true)
    if (result) {
      return true
    } else {
      const res = await uploadChunkServ.checkChunkUploadState(hash)
      if (res.length === 0) {
        const params = {
          hash,
          size,
          type,
          name,
        }
        await uploadService.createFileInfo({ ...params, isFinish: false })
        await fs.promises.mkdir(filename)
        return false
      } else {
        return res
      }
    }
  })
)

router.post(
  '/',
  upload.single('chunk'),
  asyncHandler(async (ctx, next) => {
    return await uploadChunkServ.uploadChunk(ctx.body)
  })
)

router.get(
  '/finish/:hash',
  asyncHandler(async (ctx, next) => {
    const hash = ctx.params.hash
    const result = await uploadService.getUploadFile(hash,false)
    console.log("🚀 ~ file: uploadChunk.js:70 ~ asyncHandler ~ result:", result)
    const {type} = result
    const extensionList = {
      'image/webp': 'webp',
      'image/jpeg': 'jpeg',
      'text/plain': 'txt',
      'video/x-matroska': 'mkv'
    }
    const extension = extensionList[type]
    //合并文件
    await thunkStreamMerge(
      `${uploadChunkPath}/${hash}`,
      `${uploadFilesPath}/${hash}.${extension}`
    )
    await uploadService.uploadFinish(hash)

    // await uploadService.uploadFinish(ctx.params)
    // const res = await uploadChunkServ.destroyChunk(hash)
  })
)

/**
 *文件合并
 * @param {*} sourceFiles 源文件目录：存放所有切片文件的目录
 * @param {*} targetFiles 目标文件：合并之后的文件名
 */
async function thunkStreamMerge(sourceFiles, targetFiles) {
  const list = await fs.promises.readdir(path.resolve(__dirname, sourceFiles))
  const fileWriteStream = fs.createWriteStream(
    path.resolve(__dirname, targetFiles)
  )
  //进行递归调用合并文件
  thunkStreamMergeProgress(list, fileWriteStream, sourceFiles)
}
/**
 * 合并每一个切片
 * @param {*} fileList 文件数据
 * @param {*} fileWriteStream 最终的写入结果
 * @param {*} sourceFiles 文件路径
 */
function thunkStreamMergeProgress(fileList, fileWriteStream, sourceFiles) {
  console.log('fileList',fileList.length)
  if (!fileList.length) {
    return fileWriteStream.end()
  }
  const currentFile = path.resolve(__dirname, sourceFiles, fileList.shift())
  const currentReadSteam = fs.createReadStream(currentFile)
  //写入文件内容，括号内的会覆盖readStream的内容
  currentReadSteam.pipe(fileWriteStream, { end: false })
  // //合并后，删除切片
  // fs.rm(currentFile, { recursive: true }, (err) => {
  //   if (err) {
  //     console.error(err.message);
  //     return;
  //   }
  // });
  currentReadSteam.on('end', () => {
    thunkStreamMergeProgress(fileList, fileWriteStream, sourceFiles)
  })
}

module.exports = router
