import axios from 'axios'
import setAuthToken from '../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

import { setCurrentUser, getErrors, refreshErrors } from './commonActions'

export const signupUser = userData => async dispatch => {
  dispatch(refreshErrors())
  try {
    const res = await axios.post('/api/v1/users/signup', userData)
    
    const { token } = res.data
    // Set token to local storage
    localStorage.setItem('jwtToken', token)
    // Set token to auth header
    setAuthToken(token)
    // Decode token to get user data
    const decoded = jwt_decode(token)
    // Set current user
    dispatch(setCurrentUser(decoded))
  } catch (err) {
    console.log(err)
    dispatch(getErrors(err.response.data))
  }
}

export const loginUser = userData => async dispatch => {
  dispatch(refreshErrors())
  try {
    const res = await axios.post('/api/v1/users/login', userData)

    const { token } = res.data
    // Set token to local storage
    localStorage.setItem('jwtToken', token)
    // Set token to auth header
    setAuthToken(token)
    // Decode token to get user data
    const decoded = jwt_decode(token)
    // Set current user
    dispatch(setCurrentUser(decoded))
  } catch (err) {
    console.log(err)
    dispatch(getErrors(err.response.data))
  }
}

export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty object thus isAuthenticated to false
  dispatch(setCurrentUser({}))
}
