import axios from 'axios'
import {
  GET_PROFILE,
  UPDATE_PROFILE,
  DELETE_PROFILE
} from '../types'

import { getErrors, getToastErrors, resetResponse, getResponse, showToast } from './commonActions'

export const getProfile = () => async dispatch => {
  dispatch(resetResponse())
  try {
    const res = await axios.get('/api/v1/profiles')

    dispatch({
      type: GET_PROFILE,
      payload: res.data.data
    })
    dispatch(getResponse(res.data))
  } catch (error) {
    console.log(error)
    dispatch(getErrors(error.response.data))
  }
}

export const updateProfile = profile => async dispatch => {
  dispatch(resetResponse())
  try {
    const res = await axios.put('/api/v1/profiles', profile)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.data
    })
    dispatch(getResponse(res.data))
    dispatch(showToast(res.data))
  } catch (error) {
    console.log(error)
    dispatch(getErrors(error.response.data))
  }
}

export const deleteProfile = () => async dispatch => {
  dispatch(resetResponse())
  try {
    const res = await axios.delete('/api/v1/profiles')

    dispatch({
      type: DELETE_PROFILE,
      payload: res.data.data
    })
    dispatch(getResponse(res.data))
    dispatch(showToast(res.data))
  } catch (error) {
    console.log(error)
    dispatch(getToastErrors(error.response.data))
  }
}