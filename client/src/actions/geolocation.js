import {
  UPDATE_USER
} from './index'

function geolocSuccess(user) {
  return {
    type: UPDATE_USER,
    user
  }
}

function geolocateUser() {
  return (dispatch, getState) => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, () => setPosition(null));
      } else {
        setPosition(null)
      }
    }
    
    function setPosition(position) {
      const body = {
        type: position ? 'js' : 'ip',
      }
      
      if (position) {
        body.latitude = position.coords.latitude
        body.longitude = position.coords.longitude
      }
      const headers = new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
        'Content-Type': 'application/json'
      })
      fetch('/api/geolocate', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(res => {
        const user = Object.assign({}, getState().userAuth.user, res)
        dispatch(geolocSuccess(user))
      })
      .catch(err => {
        dispatch(geolocSuccess(getState().userAuth.user))
      })
    }

    getLocation()
  }
}

export default geolocateUser