//import { notifSocket } from './socket'

export const GET_CONV_REQUEST = 'GET_CONV_REQUEST'
export const GET_CONV_SUCCESS = 'GET_CONV_SUCCESS'
export const GET_CONV_FAILURE = 'GET_CONV_FAILURE'

function getConvRequest() {
  return {
    type: GET_CONV_REQUEST
  }
}

function getConvSuccess(messages) {
  return {
    type: GET_CONV_SUCCESS,
    messages
  }
}

function getConvFailure() {
  return {
    type: GET_CONV_FAILURE
  }
}

export function getMessagesConv(id) {
  return ((dispatch) => {
    dispatch(getConvRequest())
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      'Content-Type': 'application/json'
    })
    fetch('/api/messages/conv', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({
          id: id
        })
      })
      .then(res => res.json())
        .then(messages => {
          dispatch(getConvSuccess(messages))
          dispatch(getMessagesUser())
        })
        .catch((error) => {
          dispatch(getConvFailure())
        });
  })
    
}


export const PUT_MESS_REQUEST = 'PUT_MESS_REQUEST'
export const PUT_MESS_SUCCESS = 'PUT_MESS_SUCCESS'
export const PUT_MESS_FAILURE = 'PUT_MESS_FAILURE'

function newMessRequest() {
  return {
    type: PUT_MESS_REQUEST
  }
}

function newMessSuccess() {
  return {
    type: PUT_MESS_SUCCESS
  }
}

function newMessFailure() {
  return {
    type: PUT_MESS_FAILURE
  }
}

export function newMess(message, id) {
  return ((dispatch) => {
    dispatch(newMessRequest())
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      'Content-Type': 'application/json'
    })
    fetch('/api/messages/new', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({
          message: message,
          id: id
        })
      })
      .then(res => res.text())
        .then(messages => {
          dispatch(newMessSuccess())
          dispatch(getMessagesConv(id))
        })
        .catch((error) => {
          dispatch(newMessFailure())
        });
  })
    
}

export const GET_CONVS_REQUEST = 'GET_CONVS_REQUEST'
export const GET_CONVS_SUCCESS = 'GET_CONVS_SUCCESS'
export const GET_CONVS_FAILURE = 'GET_CONVS_FAILURE'

function getConvsRequest() {
  return {
    type: GET_CONVS_REQUEST
  }
}

function getConvsSuccess(convs) {
  return {
    type: GET_CONVS_SUCCESS,
    convs
  }
}

function getConvsFailure() {
  return {
    type: GET_CONVS_FAILURE
  }
}

export function getConvs() {
  return ((dispatch) => {
    dispatch(getConvsRequest())
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      'Content-Type': 'application/json'
    })
    fetch('/api/messages/convs', {
        method: 'GET',
        credentials: 'same-origin',
        headers
      })
      .then(res => res.json())
        .then(convs => {
          dispatch(getConvsSuccess(convs))
        })
        .catch((error) => {
          dispatch(getConvsFailure())
        });
  })
    
}

export const SEARCH_CONV_REQUEST = 'SEARCH_CONV_REQUEST'
export const SEARCH_CONV_SUCCESS = 'SEARCH_CONV_SUCCESS'
export const SEARCH_CONV_FAILURE = 'SEARCH_CONV_FAILURE'

function searchConvRequest() {
  return {
    type: SEARCH_CONV_REQUEST
  }
}

function searchConvSuccess(matchs) {
  return {
    type: SEARCH_CONV_SUCCESS,
    matchs
  }
}

function searchConvFailure() {
  return {
    type: SEARCH_CONV_FAILURE
  }
}

export function searchConv(matchs) {
  return ((dispatch) => {
    dispatch(searchConvRequest())
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      'Content-Type': 'application/json'
    })
    fetch('/api/messages/searchMatchs', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({
          matchs: matchs
        })
      })
      .then(res => res.json())
        .then(matchs => {
          dispatch(searchConvSuccess(matchs))
        })
        .catch((error) => {
          dispatch(searchConvFailure())
        });
  })
    
}

export const MESS_ALL_REQUEST = 'MESS_ALL_REQUEST'
export const MESS_ALL_SUCCESS = 'MESS_ALL_SUCCESS'
export const MESS_ALL_FAILURE = 'MESS_ALL_FAILURE'

function getMessagesUserRequest() {
  return {
    type: MESS_ALL_REQUEST
  }
}

function getMessagesUserSuccess(count) {
  return {
    type: MESS_ALL_SUCCESS,
    count
  }
}

function getMessagesUserFailure() {
  return {
    type: MESS_ALL_FAILURE
  }
}

export function getMessagesUser() {
  return ((dispatch) => {
    dispatch(getMessagesUserRequest())
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    })
    fetch('/api/messages/countMessages', {
        method: 'GET',
        credentials: 'same-origin',
        headers
      })
      .then(res => res.json())
        .then(messages => {
          dispatch(getMessagesUserSuccess(messages[0].count))
        })
        .catch((error) => {
          dispatch(getMessagesUserFailure())
        });
  })
    
}

