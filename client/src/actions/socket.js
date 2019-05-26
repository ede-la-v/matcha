import socketIOClient from 'socket.io-client'
import { getConvs, getMessagesUser } from './chat'

export const SOCKET_SUCCESS = 'SOCKET_SUCCESS'
export function connectSocket(id) {
  return ((dispatch) => {

    const socket = socketIOClient("http://localhost:3001");
    dispatch(socketSuccess(socket, id))
    
  })
    
}

export function socketSuccess(socket, id) {
  return ((dispatch) => {

    socket.emit('credentials', id)
    socket.on('notif', (notif) => {
      dispatch(notifSocket(notif, 1))
    })
    socket.on('message', () => {
      dispatch(getConvs())
      dispatch(getMessagesUser())
    })
    dispatch(socketSuccess2(socket))
  })
    
}

function socketSuccess2(socket) {
  return {
    type: SOCKET_SUCCESS,
    socket
  }
}

export const NOTIF_SUCCESS = 'NOTIF_SUCCESS'

export function notifSocket(notif, count) {
    return {
      type: NOTIF_SUCCESS,
      notif,
      count
    }    
}
