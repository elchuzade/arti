const Validator = require('validator')
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Receipt = require('../../models/Receipt')
const Profile = require('../../models/Profile')

// AWS IMAGES
const aws = require('aws-sdk')
const config = require('../../config/keys')
const upload = require('../files')
const receiptImage = upload.uploadReceiptImage.single('receiptImage')
// const extractImageData = upload.extractImageData

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
})

const s3 = new aws.S3()

// @route POST receipts/
// @desc Upload receipt with user id
// @access PRIVATE
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {}
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (profile !== null) {
      if (profile.deleted) {
        errors.profile = 'Profile is deleted'
        return res.status(401).json(errors)
      }
      // Create Receipt Image
      receiptImage(req, res, err => {
        if (err) {
          console.log(err)
          errors.uploadfail = 'Failed to upload an image'
          return res.status(400).json(errors)
        }
        if (req.file == undefined) {
          console.log(err)
          errors.selectfail = 'No file selected'
          return res.json(errors)
        }

        extractImageData(req.file.key).then(data => {
          console.log('data - ', data)
          // Create a new receit
          const receipt = new Receipt({
            user: req.user.id
          })

          /* ------ EXTRACT ORGANIZATION NAME ------ */
          for (let i = 0; i < data.Blocks.length; i++) {
            // Usually the first object with BlockType 'Line' that is shown in the Blocks list
            if (data.Blocks[i].BlockType === 'LINE') {
              // Found first BlockType of LINE. This is the organization name
              receipt.organizationName = {
                text: data.Blocks[i].Text,
                confidence: data.Blocks[i].Confidence
              }
              break
            }
          }
          /* ------ EXTRACT TAX NUMBER ------ */
          // Usually tax number is made of 10 digits. check for exactly 10 consecutive digits
          let taxNumber = ''
          for (let i = 0; i < data.Blocks.length; i++) {
            // Loop through each character in Text field and check if it is a number
            // If so add it to taxNumber and make sure it's length is 10 not less not more to stop counting
            if (data.Blocks[i].Text) {
              if (data.Blocks[i].Text.length >= 10) {
                for (let j = 0; j < data.Blocks[i].Text.length; j++) {
                  if (Validator.isInt(data.Blocks[i].Text[j])) {
                    taxNumber += data.Blocks[i].Text[j]
                    if (taxNumber.length === 10) {
                      // We collected 10 digits in a row so tax number is complete
                      receipt.taxNumber = {
                        text: taxNumber,
                        confidence: data.Blocks[i].Confidence
                      }
                      break
                    }
                  } else {
                    taxNumber = ''
                  }
                }
                // Stop looping through blocks if first block is found with viable tax number
                if (taxNumber.length === 10) {
                  break
                }
              }
            }
          }

          /* ------ EXTRACT DATE ------ */
          const dateRegex = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/)
          // Loop through all text fields that are longer than the expected pattern ie xx/xx/xxxx
          for (let i = 0; i < data.Blocks.length; i++) {
            if (data.Blocks[i].Text) {
              // 10 characters or more (mre because other cahracters may be grouped together with it)
              if (data.Blocks[i].Text.length >= 10) {
                // Then loop through every 10 digit combination to see if any is a valid date based on REGEX
                // /^\d{2}\/\d{2}\/\d{4}$/ Exit when the first encounter is made, since date is usually at the very top
                for (let j = 0; j <= data.Blocks[i].Text.length - 10; j++) {
                  if (dateRegex.test(data.Blocks[i].Text.slice(j, j + 10))) {
                    // We passed regex test, means we found our date
                    receipt.date = {
                      text: data.Blocks[i].Text.slice(j, j + 10),
                      Confidence: data.Blocks[i].Confidence
                    }
                    break
                  }
                }
              }
            }
          }

          /* ------ EXTRACT TIME ------ */
          const timeRegex = new RegExp(/^\d{2}\:\d{2}\:\d{2}$/)
          // Loop through all text fields that are longer than the expected pattern ie xx/xx/xxxx
          for (let i = 0; i < data.Blocks.length; i++) {
            if (data.Blocks[i].Text) {
              // 10 characters or more (mre because other cahracters may be grouped together with it)
              if (data.Blocks[i].Text.length >= 8) {
                // Then loop through every 8 digit combination to see if any is a valid date based on REGEX
                // /^\d{2}\/\d{2}\/\d{4}$/ Exit when the first encounter is made, since date is usually at the very top
                for (let j = 0; j <= data.Blocks[i].Text.length - 8; j++) {
                  if (timeRegex.test(data.Blocks[i].Text.slice(j, j + 8))) {
                    // We passed regex test, means we found our date
                    receipt.time = {
                      text: data.Blocks[i].Text.slice(j, j + 8),
                      Confidence: data.Blocks[i].Confidence
                    }
                    break
                  }
                }
              }
            }
          }

          /* ------ EXTRACT FIS NO ------ */
          // Fis No will have 6 characters including space in between and it will definitely have F, N, O characters.
          // The value after that is considered to be fis no value
          // for (let i = 0; i < data.Blocks.length; i++) {
          //   if (data.Blocks[i].Text) {
          //     if (data.Blocks[i].Text.length === 6 && 
          //     data.Blocks[i].Text.toLowerCase().includes('f') &&
          //     data.Blocks[i].Text.toLowerCase().includes('n') &&
          //     data.Blocks[i].Text.toLowerCase().includes('o')) {
          //       let modifiedReceiptNumber = data.Blocks[i+1].Text
          //       // found Fis No. It means i+1 is the actual value. Trim i+1 until it becomes a real number
          //       while (!Validator.isInt(modifiedReceiptNumber)) {
          //         modifiedReceiptNumber = modifiedReceiptNumber.substring(1);
          //       }
          //       receipt.receiptNumber = {
          //         text: modifiedReceiptNumber,
          //         confidence: data.Blocks[i+1].Confidence
          //       }
          //         break
          //     }
          //   }
          // }

          /* ------ EXTRACT TAX AMOUNT ------ */
          // Tax Amount will come after 'TOPKDV'
          // for (let i = 0; i < data.Blocks.length; i++) {
          //   if (data.Blocks[i].Text) {
          //     if (data.Blocks[i].Text === 'TOPKDV') {
          //       let modifiedTaxAmount = data.Blocks[i+1].Text
          //       // found Fis No. It means i+1 is the actual value. Trim i+1 until it becomes a real number
          //       while (!Validator.isInt(modifiedTaxAmount)) {
          //         modifiedTaxAmount = modifiedTaxAmount.substring(1);
          //       }
          //       receipt.taxAmount = {
          //         text: modifiedTaxAmount,
          //         confidence: data.Blocks[i+1].Confidence
          //       }
          //       break
          //     }
          //   }
          // }

          /* ------ EXTRACT TOTAL AMOUNT ------ */
          // Tax Amount will come after 'TOPLAM'
          // for (let i = 0; i < data.Blocks.length; i++) {
          //   if (data.Blocks[i].Text) {
          //     if (data.Blocks[i].Text === 'TOPLAM') {
          //       let modifiedTotalAmount = data.Blocks[i+1].Text
          //       // found Fis No. It means i+1 is the actual value. Trim i+1 until it becomes a real number
          //       while (!Validator.isInt(modifiedTotalAmount)) {
          //         modifiedTotalAmount = modifiedTotalAmount.substring(1);
          //       }
          //       receipt.totalAmount = {
          //         text: modifiedTotalAmount,
          //         confidence: data.Blocks[i+1].Confidence
          //       }
          //       break
          //     }
          //   }
          // }

          receipt.image = {
            location: req.file.location,
            key: req.file.key,
            bucket: req.file.bucket,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            fieldName: req.file.metadata.fieldName
          }

          receipt
            .save()
            .then(savedReceipt => {
              // Successfully uploaded to AWS
              return res.status(200).json({ message: 'Uploaded Profile Screenshot', status: 'success', receipt: savedReceipt })
            })
        }).catch(err => 
          console.log('error - ', err)
        )

        // Successfully uploaded to AWS
        // return res.status(200).json({ message: 'Uploaded Profile Screenshot', status: 'success' })

        // profile
        //   .save()
        //   .then(savedProfile => res.status(200).json({ message: 'Uploaded Profile Screenshot', status: 'success', data: savedProfile }))
        //   .catch(err => {
        //     console.log(err)
        //     errors.profile = 'Could not upload Profile Screenshot'
        //     return res.status(404).json(errors)
        //   })
      })
    }
  } catch (error) {
    console.log(error)
    errors.profile = 'Could not upload Profile Screenshot'
    return res.status(404).json(errors)
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
       FeatureTypes: ['FORMS']
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

module.exports = router
