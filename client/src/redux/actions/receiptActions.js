import axios from 'axios'
import {
  UPLOAD_RECEIPT
} from '../types'

import { getErrors, getToastErrors, resetResponse, getResponse, showToast } from './commonActions'

export const uploadIcon = (data) => async dispatch => {
  dispatch(resetResponse())
  try {
    const config = {
      headers: {
        'content-type': 'multipart/form/data'
      }
    }
    const res = await axios.post(`/api/v1/receipts`, data, config)

    dispatch({
      type: UPLOAD_RECEIPT,
      payload: res.data.data
    })
    dispatch(getResponse(res.data))
    dispatch(showToast(res.data))
  } catch (error) {
    console.log(error)
    dispatch(getToastErrors(error.response.data))
  }
}