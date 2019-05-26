import {
  GEOLOC_REQUEST,
  GEOLOC_SUCCESS,
  GEOLOC_FAILURE
} from '../actions/geolocation'

function geolocation(
  state = {
    isFetching: false,
    location: {},
    error: ''
  }
)