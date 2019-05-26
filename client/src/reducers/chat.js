import {
  GET_CONV_REQUEST,
  GET_CONV_SUCCESS,
  GET_CONV_FAILURE
} from '../actions/chat'

import {
  PUT_MESS_REQUEST,
  PUT_MESS_SUCCESS,
  PUT_MESS_FAILURE
} from '../actions/chat'

import {
  GET_CONVS_REQUEST,
  GET_CONVS_SUCCESS,
  GET_CONVS_FAILURE
} from '../actions/chat'

import {
  SEARCH_CONV_REQUEST,
  SEARCH_CONV_SUCCESS,
  SEARCH_CONV_FAILURE
} from '../actions/chat'

import {
  MESS_ALL_REQUEST,
  MESS_ALL_SUCCESS,
  MESS_ALL_FAILURE
} from '../actions/chat'



export function getConv(
  state = {
    isFetching: false,
    messages: [],
    error: '',
    isMessages: false
  },
  action
) {
  switch(action.type) {
    case GET_CONV_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isMessages: false
      })
    case GET_CONV_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        messages: action.messages,
        isMessages: true
      })
    case GET_CONV_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups messages import failed!',
        isMessages: false
      })
    default:
      return state
  }
}



export function newMess(
  state = {
    isFetching: false,
    error: '',
  },
  action
) {
  switch(action.type) {
    case PUT_MESS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case PUT_MESS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false
      })
    case PUT_MESS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups new mess failed!'
      })
    default:
      return state
  }
}

export function getConvs(
  state = {
    isFetching: false,
    convs: [],
    error: '',
    isConvs: false
  },
  action
) {
  switch(action.type) {
    case GET_CONVS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isConvs: false
      })
    case GET_CONVS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        convs: action.convs,
        isConvs: true
      })
    case GET_CONVS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups convers import failed!',
        isConvs: false
      })
    default:
      return state
  }
}

export function searchMatchs(
  state = {
    isFetching: false,
    matchs: [],
    error: '',
    isMatchs: false
  },
  action
) {
  switch(action.type) {
    case SEARCH_CONV_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isMatchs: false
      })
    case SEARCH_CONV_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        matchs: action.matchs,
        isMatchs: true
      })
    case SEARCH_CONV_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups convers import failed!',
        isMatchs: false
      })
    default:
      return state
  }
}

export function getMessagesUser(
  state = {
    isFetching: false,
    count: 0,
    error: '',
    isCount: false
  },
  action
) {
  switch(action.type) {
    case MESS_ALL_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isCount: false
      })
    case MESS_ALL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        count: action.count,
        isCount: true
      })
    case MESS_ALL_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups count failed!',
        isCount: false
      })
    default:
      return state
  }
}


