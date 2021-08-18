import {
  GET_PROFILE,
  UPDATE_PROFILE,
  DELETE_PROFILE
} from '../types'

const initialState = {
  profile: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
    case DELETE_PROFILE:
      return {
        ...state,
        profile: action.payload
      }
    default:
      return state
  }
}
