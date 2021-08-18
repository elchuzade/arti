import isEmpty from '../../validation/is-empty'
import { LOADING_AUTH, STOP_LOADING_AUTH, SET_CURRENT_USER } from '../types'

const initialState = {
  isAuthenticated: false,
  user: {},
  loadingAuth: true,
  adminView: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        adminView: !isEmpty(action.payload)
      }
    case LOADING_AUTH:
      return {
        ...state,
        loadingAuth: true
      }
    case STOP_LOADING_AUTH:
      return {
        ...state,
        loadingAuth: false
      }
    default:
      return state
  }
}
