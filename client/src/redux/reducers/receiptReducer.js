import {
  UPLOAD_RECEIPT
} from '../types'

const initialState = {
  receipt: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_RECEIPT:
      return {
        ...state,
        receipt: action.payload
      }
    default:
      return state
  }
}
