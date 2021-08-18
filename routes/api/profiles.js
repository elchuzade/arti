const express = require('express')
const router = express.Router()
const passport = require('passport')

// Load Input Validation
const validateProfileInput = require('../../validation/profile')

const Profile = require('../../models/Profile')

// @route PUT profiles/
// @desc Update profile
// @access PRIVATE
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body)
  // Check for validation errors
  if (!isValid) {
    return res.status(400).json(errors)
  }
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (profile !== null) {
      if (profile.deleted) {
        errors.profile = 'Profile is deleted'
        return res.status(400).json(errors)
      }
      // Updated fields
      profile.name = req.body.name
      // Save made updates
      const updatedProfile = await profile.save()
      // Return result of updated profile
      return res.status(200).json({ message: 'Updated Profile', status: 'success', data: updatedProfile })
    }
  } catch (error) {
    console.log(error)
    errors.profile = 'Profile not found'
    return res.status(404).json(errors)
  }
})

// @route DELETE profiles/
// @desc Delete profile
// @access PRIVATE
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {}
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (profile !== null) {
      if (profile.deleted) {
        errors.profile = 'Profile is deleted'
        return res.status(400).json(errors)
      }
      // Updated fields
      profile.deleted = true
      // Save made updates
      const deletedProfile = await profile.save()
      // Return result of updated profile
      return res.status(200).json({ message: 'Deleted Profile', status: 'success', data: deletedProfile })
    }
  } catch (error) {
    console.log(error)
    errors.profile = 'Profile not found'
    return res.status(404).json(errors)
  }
})

// @route GET profiles/
// @desc Get profile
// @access PRIVATE
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {}
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (profile !== null) {
      if (profile.deleted) {
        errors.profile = 'Profile is deleted'
        return res.status(400).json(errors)
      }
      
      // Return found profile
      return res.status(200).json({ message: 'Found Profile', status: 'success', data: profile })
    }
  } catch (error) {
    console.log(error)
    errors.profile = 'Profile not found'
    return res.status(404).json(errors)
  }
})

module.exports = router
