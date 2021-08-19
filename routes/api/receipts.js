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
router.post('/',
// passport.authenticate('jwt', { session: false }),
async (req, res) => {
  const errors = {}
  try {
    // const profile = await Profile.findOne({ user: req.user.id })

    // if (profile !== null) {
      // if (profile.deleted) {
      //   errors.profile = 'Profile is deleted'
      //   return res.status(401).json(errors)
      // }
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
          // console.log('data - ', data)
          // Create a new receit
          const receipt = new Receipt({
            // user: req.user.id
          })

          receipt.taxNumber = extractTaxNumber(data.Blocks)
          receipt.date = extractDate(data.Blocks)
          receipt.time = extractTime(data.Blocks)
          receipt.receiptNumber = extractReceiptNumber(data.Blocks)

          const taxAndTotalAmount = extractTaxAndTotalAmount(data.Blocks)
          receipt.taxAmount = {
            text: taxAndTotalAmount.taxAmount.Text,
            confidence: taxAndTotalAmount.taxAmount.Confidence,
          }
          receipt.totalAmount = {
            text: taxAndTotalAmount.totalAmount.Text,
            confidence: taxAndTotalAmount.totalAmount.Confidence
          }

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
              return res.status(200).json({ message: 'Uploaded Receipt', status: 'success', receipt: savedReceipt })
            })
        }).catch(err => 
          console.log('error - ', err)
        )

        // Successfully uploaded to AWS
        // return res.status(200).json({ message: 'Uploaded Receipt', status: 'success' })

        // profile
        //   .save()
        //   .then(savedProfile => res.status(200).json({ message: 'Uploaded Receipt', status: 'success', data: savedProfile }))
        //   .catch(err => {
        //     console.log(err)
        //     errors.profile = 'Could not upload Receipt'
        //     return res.status(404).json(errors)
        //   })
      })
  } catch (error) {
    console.log(error)
    errors.profile = 'Could not upload Receipt'
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

const extractTaxNumber = blocks => {
  let taxNumber = ''
  for (let i = 0; i < blocks.length; i++) {
    // Loop through each character in Text field and check if it is a number
    // If so add it to taxNumber and make sure it's length is 10 to stop counting
    if (blocks[i].Text) {
      if (blocks[i].Text.length >= 10) {
        for (let j = 0; j < blocks[i].Text.length; j++) {
          if (Validator.isInt(blocks[i].Text[j])) {
            taxNumber += blocks[i].Text[j]
            if (taxNumber.length === 10) {
              // We collected 10 digits in a row so tax number is complete
              return {
                text: taxNumber,
                confidence: blocks[i].Confidence
              }
            }
          } else {
            taxNumber = ''
          }
        }
      }
    }
  }
  return undefined
}

const extractDate = blocks => {
  const dateRegex = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/)
  // Loop through all text fields that are longer than the expected pattern ie xx/xx/xxxx
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].Text) {
      // 10 characters or more (mre because other cahracters may be grouped together with it)
      if (blocks[i].Text.length >= 10) {
        // Then loop through every 10 digit combination to see if any is a valid date based on REGEX
        // /^\d{2}\/\d{2}\/\d{4}$/ Exit when the first encounter is made, since date is usually at the very top
        for (let j = 0; j <= blocks[i].Text.length - 10; j++) {
          if (dateRegex.test(blocks[i].Text.slice(j, j + 10))) {
            // We passed regex test, means we found our date
            return {
              text: blocks[i].Text.slice(j, j + 10),
              confidence: blocks[i].Confidence
            }
          }
        }
      }
    }
  }
  return undefined
}

const extractTime = blocks => {
  const timeRegexLong = new RegExp(/^\d{2}\:\d{2}\:\d{2}$/)
  // Loop through all text fields that are longer than the expected pattern ie xx/xx/xxxx
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].Text) {
      // 10 characters or more (mre because other cahracters may be grouped together with it)
      if (blocks[i].Text.length >= 8) {
        // Then loop through every 8 digit combination to see if any is a valid time based on long REGEX
        // /^\d{2}\:\d{2}\:\d{2}$/ Exit when the first encounter is made, since date is usually at the very top
        for (let j = 0; j <= blocks[i].Text.length - 8; j++) {
          if (timeRegexLong.test(blocks[i].Text.slice(j, j + 8))) {
            // We passed regex test, means we found our time
            return {
              text: blocks[i].Text.slice(j, j + 8),
              confidence: blocks[i].Confidence
            }
          }
        }
      }
    }
  }

  const timeRegexShort = new RegExp(/^\d{2}\:\d{2}$/)
  // const timeRegexShort = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  // Loop through all text fields that are longer than the expected pattern ie xx/xx/xxxx
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].Text) {
      // 10 characters or more (mre because other cahracters may be grouped together with it)
      if (blocks[i].Text.length >= 5) {
        // Then loop through every 5 digit combination to see if any is a valid time based on short REGEX
        // /^\d{2}\:\d{2}$/ Exit when the first encounter is made, since date is usually at the very top
        for (let j = 0; j <= blocks[i].Text.length - 5; j++) {
          if (timeRegexShort.test(blocks[i].Text.slice(j, j + 5))) {
            // We passed regex test, means we found our time
            return {
              text: blocks[i].Text.slice(j, j + 5),
              confidence: blocks[i].Confidence
            }
          }
        }
      }
    }
  }
}

const extractOrganizationName = blocks => {
  for (let i = 0; i < blocks.length; i++) {
    // Usually the first object with BlockType 'Line' that is shown in the Blocks list
    if (blocks[i].BlockType === 'LINE') {
      // Found first BlockType of LINE. This is the organization name
      return {
        text: blocks[i].Text,
        confidence: blocks[i].Confidence
      }
      break
    }
  }
}

const extractReceiptNumber = blocks => {
  // Receipt Number must be anywhere after tax Number
  // It has to have 4 digits in a row and not include forward slash

  // Find index of taxNumber
  const taxNumber = extractTaxNumber(blocks)
  let taxNumberIndex = null

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].Text) {
      if (blocks[i].Text.includes(taxNumber.text)) {
        // Found index of tax number. receipt number comes somewhere after it
        taxNumberIndex = i
        // Tax number exists at the top of the receipt and bottom.
        // We need to stop looping at the top
        break
      }
    }
  }

  let treceiptNumber = ''
  for (let i = taxNumberIndex+1; i < blocks.length; i++) {
    if (blocks[i].Text) {
      // 4 digits at least
      if (blocks[i].Text.length >= 4) {
        if (!blocks[i].Text.includes('/')) {
          for (let j = 0; j < blocks[i].Text.length; j++) {
            if (Validator.isInt(blocks[i].Text[j])) {
              treceiptNumber += blocks[i].Text[j]
              if (treceiptNumber.length === 4) {
                // We collected 4 digits in a row so receipt number is complete
                return {
                  text: treceiptNumber,
                  confidence: blocks[i].Confidence
                }
              }
            } else {
              treceiptNumber = ''
            }
          }
        }
      }
    }
  }
  return undefined
}

const extractTaxAndTotalAmount = blocks => {
  let candidates = []
  // Extract only values that have * and , in them
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].Text) {
      if ((blocks[i].Text.includes('*') || blocks[i].Text.includes('+')) &&
      (blocks[i].Text.includes(',') || blocks[i].Text.includes('.'))) {
        candidates.push(blocks[i])
      }
    }
  }
  
  // Remove leading * and all dots . and commas
  candidates = candidates.map(uc => ({
      ...uc,
      Text: uc.Text.substring(1).replace('.', '').replace(',', '')
    })
  )

  for (let i = 0; i < candidates.length; i++) {
    // Since we removed all dots and commas we need to add one 
    if (Validator.isInt(candidates[i].Text[candidates[i].Text.length - 1])) {
      // Last character is a number, count to 3 from the end
      candidates[i].Text =
        candidates[i].Text.slice(0, candidates[i].Text.length - 2) + ',' +
        candidates[i].Text.slice(candidates[i].Text.length - 2)
    }
  }

  let uniqueCandidates = []
  // Make them unique
  for (let i = 0; i < candidates.length; i++) {
    if (!uniqueCandidates.some(uc => uc.Text === candidates[i].Text)) {
      uniqueCandidates.push(candidates[i])
    }
  }

  // Compare the float values to get taxAmount and totalAmount
  let taxAmount = {}
  let totalAmount = {}
  
  // Remove values that have blank space in them
  uniqueCandidates = uniqueCandidates.filter(uc => !uc.Text.includes(' '))

  if (uniqueCandidates.length === 2) {
    if (parseFloat(uniqueCandidates[0].Text) > parseFloat(uniqueCandidates[1].Text)) {
      totalAmount = uniqueCandidates[0]
      taxAmount = uniqueCandidates[1]
    } else {
      totalAmount = uniqueCandidates[1]
      taxAmount = uniqueCandidates[0]
    }
  }

  return {
    taxAmount,
    totalAmount
  }
}

module.exports = router
