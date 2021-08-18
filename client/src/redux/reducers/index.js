import { combineReducers } from 'redux'
import authReducer from './authReducer'
import responseReducer from './responseReducer'
import profileReducer from './profileReducer'
import receiptReducer from './receiptReducer'

export default combineReducers({
  auth: authReducer,
  response: responseReducer,
  profile: profileReducer,
  receipt: receiptReducer
})
