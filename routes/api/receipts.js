/*

Take a picture of your receipt. Click use photo.
This will automatically call a function to upload a photo to the server.
Thsi will create a new image entry, then as it is successfully created,
it will send the image to be analyzed by Textract.
Based on results it will compare if current entry already exists.
And if does exist it will remove the image and upload this image instead.
If does not exist it will create a new entry and connect extracted data and image to it
for player.receipts array

*/

const express = require('express')
const router = express.Router()
const passport = require('passport')

// Load Input Validation
const validateReceiptInput = require('../../validation/receipt')

const Receipt = require('../../models/Receipt')
const Profile = require('../../models/Profile')

// AWS IMAGES
const aws = require('aws-sdk')
const config = require('../../config/keys')
const upload = require('../files')
const receiptImage = upload.uploadReceiptImage.single('receiptImage')

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
})

const s3 = new aws.S3()

// @route POST receipts/:id
// @desc Upload receipt with user id
// @access PRIVATE
router.post('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {}
  try {
    const profile = Profile.findById(req.params.id)

    if (profile !== null) {
      if (profile.user.toString() !== req.user.id) {
        errors.profile = 'Unautorized'
        return res.status(401).json(errors)
      }
      if (profile.deleted) {
        errors.profile = 'Profile is deleted'
        return res.status(401).json(errors)
      }
      // Check if the profile screenshot already exists? delete and make a new one
      let foundReceiptIndex = null;
      for (let i = 0; i < profile.receipts.length; i++) {
        if (profile.receipts[i].amount === req.body.amount &&
          profile.receipts[i].taxNumber === req.body.taxNumber &&
          profile.receipts[i].date === req.body.date) {
            foundReceipt = foundReceiptIndex
          }
      }
      if (foundReceiptIndex &&
        profile.receipts[foundReceiptIndex].image &&
        profile.receipts[foundReceiptIndex].image.key
      ) {
        const params = {
          Bucket: profile.receipts[foundReceiptIndex].image.bucket,
          Delete: {
            Objects: [{ Key: profile.receipts[foundReceiptIndex].image.key }]
          }
        }
        s3.deleteObjects(params, (err, data) => {
          if (err) {
            console.log(err)
          } else {
            // Create Receipt
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
              profile.receipts[foundReceiptIndex].image.location = req.file.location
              profile.receipts[foundReceiptIndex].image.key = req.file.key
              profile.receipts[foundReceiptIndex].image.bucket = req.file.bucket
              profile.receipts[foundReceiptIndex].image.originalname = req.file.originalname
              profile.receipts[foundReceiptIndex].image.mimetype = req.file.mimetype
              profile.receipts[foundReceiptIndex].image.size = req.file.size
              profile.receipts[foundReceiptIndex].image.fieldName = req.file.metadata.fieldName

              profile
                .save()
                .then(savedProfile => res.status(200).json({ message: 'Uploaded Receipt Iamge', status: 'success', data: savedProfile }))
                .catch(err => {
                  console.log(err)
                  errors.profile = 'Could not upload Receipt Iamge'
                  return res.status(404).json(errors)
                })
            })
          }
        })
      } else {
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

          const newImage = {
            location: req.file.location,
            key: req.file.key,
            bucket: req.file.bucket,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            fieldName: req.file.metadata.fieldName
          }

          profile
            .save()
            .then(savedProfile => res.status(200).json({ message: 'Uploaded Profile Screenshot', status: 'success', data: savedProfile }))
            .catch(err => {
              console.log(err)
              errors.profile = 'Could not upload Profile Screenshot'
              return res.status(404).json(errors)
            })
        })
      }
    }
  } catch (error) {
    console.log(error)
    errors.profile = 'Could not upload Profile Screenshot'
    return res.status(404).json(errors)
  }
})

module.exports = router
