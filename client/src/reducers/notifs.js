import {
  GET_NOTIFS_REQUEST,
  GET_NOTIFS_SUCCESS,
  GET_NOTIFS_FAILURE
} from '../actions/notifs'

import {
  VU_NOTIFS_REQUEST,
  VU_NOTIFS_SUCCESS,
  VU_NOTIFS_FAILURE
} from '../actions/notifs'



export function getNotifsUser(
  state = {
    isFetching: false,
    error: '',
    isNotifs: false
  },
  action
) {
  switch(action.type) {
    case GET_NOTIFS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isNotifs: false
      })
    case GET_NOTIFS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isNotifs: true
      })
    case GET_NOTIFS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups notifs import failed!',
        isNotifs: false
      })
    default:
      return state
  }
}

export function vuNotifsUser(
  state = {
    isFetching: false,
    error: '',
    isNotifs: false
  },
  action
) {
  switch(action.type) {
    case VU_NOTIFS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isNotifs: false
      })
    case VU_NOTIFS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isNotifs: true
      })
    case VU_NOTIFS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups notifs vu failed!',
        isNotifs: false
      })
    default:
      return state
  }
}

