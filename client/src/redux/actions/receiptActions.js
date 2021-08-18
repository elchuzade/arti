import axios from 'axios'
import {
  UPLOAD_RECEIPT
} from '../types'

import { getToastErrors, resetResponse, getResponse } from './commonActions'

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
      payload: res.data.receipt
    })
    dispatch(getResponse(res.data))
  } catch (error) {
    console.log(error)
    dispatch(getToastErrors(error.response.data))
  }
}