const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    receipts: [
      {
        receipt: {
          type: Schema.Types.ObjectId,
          ref: 'receipt'
        },
        expired: {
          type: Boolean
        }
      }
    ],
    name: {
      type: String
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false
    }
  }, { timestamps: true }
)

module.exports = Profile = mongoose.model('profile', ProfileSchema)