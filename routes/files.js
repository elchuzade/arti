const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const config = require('../config/keys')
const checkImageFileType = require('../validation/image')

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
})

const s3 = new aws.S3()

const uploadReceiptImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.NODE_ENV === 'production' ? 'arti-main' : 'arti-staging',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      var newFileName = Date.now() + '-' + file.originalname
      var fullPath = 'receiptImage/' + newFileName
      cb(null, fullPath)
    }
  }),
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb)
  }
})

function extractImageData (documentKey) {
  return new Promise(resolve => {
     var textract = new aws.Textract({
       region: 'eu-central-1',
       endpoint: `https://textract.eu-central-1.amazonaws.com/`,
       accessKeyId: config.accessKeyId,
       secretAccessKey: config.secretAccessKey
     })
     var params = {
       Document: {
         S3Object: {
          Bucket: process.env.NODE_ENV === 'production' ? 'arti-main' : 'arti-staging',
           Name: documentKey
         }
       },
       FeatureTypes: ['RECEIPT']
     }
 
     textract.analyzeDocument(params, (err, data) => {
       if (err) {
         return resolve(err)
       } else {
         resolve(data)
       }
     })
   })
 }

module.exports.extractImageData = extractImageData
module.exports.uploadReceiptImage = uploadReceiptImage