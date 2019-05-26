import {
  SAVE_MATCHING,
  UPDATE_MATCHING,
  UPDATE_MATCHING2,
  UPDATE_AGE,
  UPDATE_POP,
  UPDATE_DIST,
  UPDATE_SEARCH,
  UPDATE_PAGE,
  UPDATE_MM,
  USE_SAVE,
  FIRST_MATCHING,
  NEW_TAG,
  SEL_TAG,
  CHANGE,
  SORT
} from '../actions/matching'

export function matching(
  state = {
    save: [],
    users: [],
    users2: [],
    isMatching: false,
    age: [18,100],
    pop: [0,1],
    dist: [0,10000],
    search: false,
    page: 0,
    min: {},
    max: {},
    sel_tags: [],
    sel_tags_tmp: [],
    bool: false,
    sort: "matching"
  },
  action
) {
  switch(action.type) {
    case FIRST_MATCHING:
      return Object.assign({}, state, {
        isMatching: true,
        users: action.users,
        users2: action.users,
        save: action.users
      })
    case SAVE_MATCHING:
      return Object.assign({}, state, {
        isMatching: true,
        users: action.users,
        users2: action.users
      })
    case UPDATE_MATCHING:
      return Object.assign({}, state, {
        users: state.users.concat(action.users),
        users2: state.users.concat(action.users)
      })
    case UPDATE_MATCHING2:
      return Object.assign({}, state, {
        users2: action.usersFilter
      })
    case USE_SAVE:
      return Object.assign({}, state, {
        users: state.save,
        users2: state.save
      })
    case UPDATE_AGE:
      return Object.assign({}, state, {
        age: action.age
      })
    case UPDATE_POP:
      return Object.assign({}, state, {
        pop: action.pop
      })
    case UPDATE_DIST:
      return Object.assign({}, state, {
        dist: action.dist
      })
    case UPDATE_SEARCH:
      return Object.assign({}, state, {
        search: action.search
      })
    case UPDATE_PAGE:
      return Object.assign({}, state, {
        page: action.page
      })
    case UPDATE_MM:
      return Object.assign({}, state, {
        min: action.min,
        max: action.max
      })
    case NEW_TAG:
      return Object.assign({}, state, {
        sel_tags: state.sel_tags.concat(action.tag)
      })
    case SEL_TAG:
      return Object.assign({}, state, {
        sel_tags_tmp: action.tag
      })
    case CHANGE:
      return Object.assign({}, state, {
        bool: action.bool
      })
    case SORT:
      return Object.assign({}, state, {
        sort: action.sort
      })
    default:
      return state
  }
}
