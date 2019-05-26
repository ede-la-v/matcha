import { combineReducers } from 'redux'
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  UNAUTH_REQUEST,
  UPDATE_USER
} from '../actions'
import { pictures } from './profil'
import { matching } from './matching'
import {connectSocket, notifSocket} from './socket'
import {getConv, newMess, getConvs, searchMatchs, getMessagesUser} from './chat'
import { tags } from './tags'
import { error } from './error'

function userAuth(
  state = {
    isFetching: false,
    user: {},
    isAuthenticated: false
  },
  action
) {
  switch(action.type) {
    case AUTH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      })
    case AUTH_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.user,
        isAuthenticated: true
      })
    case AUTH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false
      })
    case UNAUTH_REQUEST:
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: {}
      })
    case UPDATE_USER:
      return Object.assign({}, state, { user: action.user })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  userAuth, connectSocket, notifSocket, getConv, newMess, getConvs, searchMatchs, getMessagesUser, tags, error, pictures, matching
})

export default rootReducer