import {
  READ_ERROR,
  RECEIVED_ERROR
} from '../actions/error'

let id = 0

export function error(
  state = {
    errorsList: []
  },
  action
) {
  switch (action.type) {
    case RECEIVED_ERROR:
    action.error.id = id++
      return Object.assign({}, state, {
        errorsList: [...state.errorsList, action.error]
      })
    case READ_ERROR:
      return Object.assign({}, state, {
        errorsList: state.errorsList.filter(error => error.id !== action.id)
      })
    default:
      return state
  }
}
