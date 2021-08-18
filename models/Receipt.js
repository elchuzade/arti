const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReceiptSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'profile'
    },
    amount: {
      type: Number
    },
    taxNumber: {
      type: String
    },
    date: {
      type: Date
    },
    image: {
      location: {
        type: String
      },
      key: {
        type: String
      },
      bucket: {
        type: String
      },
      originalname: {
        type: String
      },
      mimetype: {
        type: String
      },
      size: {
        type: Number
      },
      fieldName: {
        type: String
      }
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false
    }
  }, { timestamps: true }
)

module.exports = Receipt = mongoose.model('receipt', ReceiptSchema)