export const GET_TAGS_REQUEST = 'GET_TAGS_REQUEST'
export const GET_TAGS_SUCCESS = 'GET_TAGS_SUCCESS'
export const GET_TAGS_FAILURE = 'GET_TAGS_FAILURE'

function getTagsRequest() {
  return {
    type: GET_TAGS_REQUEST
  }
}

export function getTagsSuccess(tagList) {
  return {
    type: GET_TAGS_SUCCESS,
    tagList
  }
}

function getTagsFailure() {
  return {
    type: GET_TAGS_FAILURE
  }
}

export function getUserTags() {
  return ((dispatch, getState) => {
    if (getState().tags.tagList.length) return
    dispatch(getTagsRequest())

    fetch('/api/me/tags', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
    .then(res => res.json())
    .then(tagList => {
      dispatch(getTagsSuccess(tagList))
    })
    .catch((error) => {
      dispatch(getTagsFailure())
    })
  })
}

export const ADD_TAG_SUCCESS = 'ADD_TAG_SUCCESS'


function addTagSuccess(tag) {
  return {
    type: ADD_TAG_SUCCESS,
    tag
  }
}


export function addTag(tag) {
  return (dispatch => {
    dispatch(addTagSuccess(tag))
  })
}

export const DEL_TAG_SUCCESS = 'DEL_TAG_SUCCESS'

export function delTag(id) {
  return {
    type: DEL_TAG_SUCCESS,
    id
  }
}

