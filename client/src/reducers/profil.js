import {
  GET_PICTURE_REQUEST,
  GET_PICTURE_SUCCESS,
  GET_PICTURE_FAILURE,
  DEL_PICTURE_REQUEST,
  DEL_PICTURE_SUCCESS,
  DEL_PICTURE_FAILURE,
  ADD_PICTURE_FAILURE,
  ADD_PICTURE_SUCCESS,
  ADD_PICTURE_REQUEST
} from '../actions/profil'



export function pictures(
  state = {
    isFetching: false,
    pictures: [],
    error: '',
    isLoaded: false
  },
  action
) {
  switch(action.type) {
    case GET_PICTURE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case GET_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        pictures: action.pictures,
        isLoaded: true
      })
    case GET_PICTURE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: 'Oups photo import failed!',
        isLoaded: true
      })
    case DEL_PICTURE_REQUEST:
      return Object.assign({}, state, {
        isDeleting: true
      })
    case DEL_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        isDeleting: false,
        pictures: state.pictures.filter(picture => picture.rank !== action.rank)
      })
    case DEL_PICTURE_FAILURE:
      return Object.assign({}, state, {
        isDeleting: false,
        error: 'Oups photo delete failed!'
      })
    case ADD_PICTURE_REQUEST:
      return Object.assign({}, state, {
        isAdding: true
      })
    case ADD_PICTURE_SUCCESS:
      const doesExist = state.pictures.filter(pic => pic.rank === action.rank).length
      return {
        ...state,
        pictures: doesExist ? state.pictures.map(picture => {
          if (picture.rank === action.rank) {
            return Object.assign({}, picture, {
              id: action.picture.id,
              data: action.picture.data
            })
          }
          return picture
        }) : [...state.pictures, action.picture]
      }
    case ADD_PICTURE_FAILURE:
      return Object.assign({}, state, {
        isAdding: false,
        error: 'Oups photo add failed!'
      })
    default:
      return state
  }
}

