import geolocateUser from './geolocation'
import { getTagsSuccess } from './tags'
import { getPicturesSuccess } from './profil'
import { fetchWrap} from '../services/fetchWrap'
import { getNotifsUser } from './notifs'
import { getMessagesUser } from './chat'
import { connectSocket } from './socket'
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_FAILURE = 'AUTH_FAILURE'

export const UNAUTH_REQUEST = 'UNAUTH_REQUEST'
export const UNAUTH_SUCCESS = 'UNAUTH_SUCCESS'
export const UNAUTH_FAILURE = 'UNAUTH_FAILURE'

export const UPDATE_USER = 'UPDATE_USER'

function authRequest() {
  return {
    type: AUTH_REQUEST
  }
}

function authSuccess(user) {
  return {
    type: AUTH_SUCCESS,
    user
  }
}

export function receivedUser(user) {
  return (dispatch => {
    dispatch(authSuccess(user.user))
    dispatch(connectSocket(user.user.id))
    dispatch(getNotifsUser())
    dispatch(getMessagesUser())
    if (!user.lat || !user.lon) {
      dispatch(geolocateUser())
    }
    dispatch(getTagsSuccess(user.tags))
    dispatch(getPicturesSuccess(user.pictures))
  })
}

/*function authFailure() {
  return {
    type: AUTH_FAILURE
  }
}*/

export function authUser(credentials) {
  return ((dispatch) => {
    dispatch(authRequest())

    fetchWrap('api/auth', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    })
    .then(payload => {
        localStorage.setItem('jwtToken', payload.token)
        dispatch(receivedUser(payload))
    })
    .catch((error) => {
        if (error && error.error)
          NotificationManager.error(error.error, 'Erreur!', 5000, () => {});
    });
  })
}

function updateUserState(user) {
  return {
    type: UPDATE_USER,
    user
  }
}

export function updateUser(change) {
  return (dispatch, getState) => {
    const user = Object.assign({}, getState().userAuth.user, change)
    dispatch(updateUserState(user))
  }
}



export function unauthUser() {
  localStorage.clear()
  return {
    type: UNAUTH_REQUEST
  }
}