import { notifSocket } from './socket'

export const GET_NOTIFS_REQUEST = 'GET_NOTIFS_REQUEST'
export const GET_NOTIFS_SUCCESS = 'GET_NOTIFS_SUCCESS'
export const GET_NOTIFS_FAILURE = 'GET_NOTIFS_FAILURE'

export const VU_NOTIFS_REQUEST = 'VU_NOTIFS_REQUEST'
export const VU_NOTIFS_SUCCESS = 'VU_NOTIFS_SUCCESS'
export const VU_NOTIFS_FAILURE = 'VU_NOTIFS_FAILURE'

export const CLICK_NOTIFS_SUCCESS = 'CLICK_NOTIFS_SUCCESS'

function getNotifsRequest() {
  return {
    type: GET_NOTIFS_REQUEST
  }
}

function getNotifsSuccess(notifs) {
  return {
    type: GET_NOTIFS_SUCCESS
  }
}

function getNotifsFailure() {
  return {
    type: GET_NOTIFS_FAILURE
  }
}

export function getNotifsUser() {
  return ((dispatch) => {
    dispatch(getNotifsRequest())
    fetch('/api/notifs/notifs_user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then(res => res.json())
        .then(notifs => {
          var count = 0;
          for (var i = 0; i < notifs.length; i++)
            if (Number(notifs[i].vu) === 0)
              count++;
          dispatch(notifSocket(notifs, count))
          dispatch(getNotifsSuccess())
        })
        .catch((error) => {
          dispatch(getNotifsFailure())
        });
  })
    
}

function vuNotifsRequest() {
  return {
    type: VU_NOTIFS_REQUEST
  }
}

function vuNotifsSuccess(notif) {
  return {
    type: VU_NOTIFS_SUCCESS
  }
}

function vuNotifsFailure() {
  return {
    type: VU_NOTIFS_FAILURE
  }
}

export function vuNotifsUser() {
  return ((dispatch) => {
    dispatch(vuNotifsRequest())
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
    })
    fetch('/api/notifs/vu', {
        method: 'GET',
        credentials: 'same-origin',
        headers
      })
      .then(res => res.text())
        .then(notifs => {
          dispatch(vuNotifsSuccess())
        })
        .catch((error) => {
          dispatch(vuNotifsFailure())
        });
  })
    
}

export function clickNotifsSuccess(notif) {
  return {
    type: CLICK_NOTIFS_SUCCESS,
    notif
  }
}

