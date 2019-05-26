import {
  GET_TAGS_SUCCESS,
  ADD_TAG_SUCCESS,
  DEL_TAG_SUCCESS
} from '../actions/tags'

export function tags(
  state = {
    tagList: []
  },
  action
) {
  switch(action.type) {
    case GET_TAGS_SUCCESS:
      return Object.assign({}, state, {
        tagList: action.tagList
      })
    case ADD_TAG_SUCCESS:
      return {
        ...state,
        tagList: state.tagList.concat(action.tag)
      }
    case DEL_TAG_SUCCESS:
      return {
        ...state,
        tagList: state.tagList.filter(word => word.id !== Number(action.id))
      }
    default:
      return state
  }
}
