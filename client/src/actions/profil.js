
import { fetchWrap} from '../services/fetchWrap'
import {NotificationManager} from 'react-notifications';

export const GET_PICTURE_REQUEST = 'GET_PHOTO_REQUEST'
export const GET_PICTURE_SUCCESS = 'GET_PHOTO_SUCCESS'
export const GET_PICTURE_FAILURE = 'GET_PHOTO_FAILURE'

function getPicturesRequest() {
  return {
    type: GET_PICTURE_REQUEST
  }
}

export function getPicturesSuccess(pictures) {
  return {
    type: GET_PICTURE_SUCCESS,
    pictures
  }
}

function getPicturesFailure() {
  return {
    type: GET_PICTURE_FAILURE
  }
}

export function getUserPictures() {
  return ((dispatch) => {
    dispatch(getPicturesRequest())

    fetch('/api/users/pictures', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
    .then(res => res.json())
    .then(pictures => {
      dispatch(getPicturesSuccess(pictures))
    })
    .catch((error) => {
      dispatch(getPicturesFailure())
    });
  })
    
}

export const DEL_PICTURE_REQUEST = 'DEL_PHOTO_REQUEST'
export const DEL_PICTURE_SUCCESS = 'DEL_PHOTO_SUCCESS'
export const DEL_PICTURE_FAILURE = 'DEL_PHOTO_FAILURE'

function delPictureRequest() {
  return {
    type: DEL_PICTURE_REQUEST
  }
}

function delPictureSuccess(rank) {
  return {
    type: DEL_PICTURE_SUCCESS,
    rank
  }
}

function delPictureFailure() {
  return {
    type: DEL_PICTURE_FAILURE
  }
}

export function delUserPicture(rank) {
  return (dispatch => {
    dispatch(delPictureRequest())

    fetch(`/api/users/pictures/${rank}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
    })
    .then(() => dispatch(delPictureSuccess(rank)), () => dispatch(delPictureFailure()))
  })
}

export const ADD_PICTURE_REQUEST = 'ADD_PHOTO_REQUEST'
export const ADD_PICTURE_SUCCESS = 'ADD_PHOTO_SUCCESS'
export const ADD_PICTURE_FAILURE = 'ADD_PHOTO_FAILURE'

function addPictureRequest() {
  return {
    type: ADD_PICTURE_REQUEST
  }
}

function addPictureSuccess(picture, rank) {
  return {
    type: ADD_PICTURE_SUCCESS,
    picture,
    rank
  }
}

function addPictureFailure() {
  return {
    type: ADD_PICTURE_FAILURE
  }
}

export function addUserPicture(picture, rank) {
  return (dispatch => {
    dispatch(addPictureRequest())
    const data = new FormData()
    
    data.append('file', picture)
    data.append('rank', rank)
    
    fetchWrap('/api/users/pictures', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: data
    })
    .then(res => {
      dispatch(addPictureSuccess(res, rank))
    })
    .catch((error) => {
      if (error && error.message)
        NotificationManager.error(error.message, 'Error', 5000, () => {})
      else
        NotificationManager.error('La photo n\'a pas pu etre uploade', 'Error', 5000, () => {})
      dispatch(addPictureFailure)
    })
  })
}