
export function Geoloc(){

  var user = JSON.parse(localStorage.getItem('conn'));
  if (user !== null && user[0].address === null)
  {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  }

  
}

function showPosition(position){
    fetch('/users/geoloc', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    });
}

function handleError(err){
  fetch('http://geoip-db.com/json/')
  .then(res => res.json())
  .then(json => {
    fetch('/users/geoloc', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: json.latitude,
        longitude: json.longitude
      })
    });
  });
}




