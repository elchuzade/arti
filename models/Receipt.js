const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReceiptSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    organizationName: {
      text: {
        type: String
      },
      confidence: {
        type: Number
      }
    },
    taxNumber: {
      text: {
        type: String
      },
      confidence: {
        type: Number
      }
    },
    date: {
      text: {
        type: String
      },
      confidence: {
        type: Number
      }
    },
    time: {
      text: {
        type: String
      },
      confidence: {
        type: Number
      }
    },
    // receiptNumber: {
    //   text: {
    //     type: String
    //   },
    //   confidence: {
    //     type: Number
    //   }
    // },
    // taxAmount: {
    //   text: {
    //     type: String
    //   },
    //   confidence: {
    //     type: Number
    //   }
    // },
    // totalAmount: {
    //   text: {
    //     type: String
    //   },
    //   confidence: {
    //     type: Number
    //   }
    // },
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