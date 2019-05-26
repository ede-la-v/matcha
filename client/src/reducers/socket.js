import {
  SOCKET_SUCCESS,
  NOTIF_SUCCESS
} from '../actions/socket'

import {
  VU_NOTIFS_SUCCESS,
  CLICK_NOTIFS_SUCCESS
} from '../actions/notifs'

export function connectSocket(
  state = {
    socket: {},
    isConnect: false
  },
  action
) {
  switch(action.type) {
    case SOCKET_SUCCESS:
      return Object.assign({}, state, {
        socket: action.socket,
        isConnect: true
      })
    default:
      return state
  }
}

export function notifSocket(
  state = {
    notif: [],
    count: 0,
    isNotif: false
  },
  action
) {
  switch(action.type) {
    case NOTIF_SUCCESS:
      return Object.assign({}, state, {
        notif: action.notif.concat(state.notif),
        count: state.count + action.count,
        isNotif: true
      })
    case VU_NOTIFS_SUCCESS:
      return Object.assign({}, state, {
        count: 0
      })
    case CLICK_NOTIFS_SUCCESS:
      return Object.assign({}, state, {
        notif: action.notif
      })
    default:
      return state
  }
}



