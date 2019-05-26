import React from 'react';
import { fetchWrap } from '../../services/fetchWrap'
import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class Inscription extends React.Component {

  getNewPass = event => {

    event.preventDefault();
    if (this.passInput.value === this.vpassInput.value){
      fetchWrap('/api/me/reset', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.props.match.params.token,
          password: this.passInput.value
        })
      })
      .then(() => {this.props.history.push(`/connexion`)})
      .catch((error) => {
           if (error && error.message)
            NotificationManager.error(error.message, 'Error', 5000, () => {});
          else
            NotificationManager.error("", 'Error', 5000, () => {});
        });  
    }
    else
      NotificationManager.error("Les 2 MDP sont differents", 'Error', 5000, () => {});
  }

  render() {
    console.log(this.props.match)
    return (
      <div>
      <div className="inscriptionBox">
        <form className="inscription" onSubmit={(e) => this.getNewPass(e)} >
          <input type="password" placeholder="MDP" required ref={(input) => { this.passInput = input}} /><br />
          <input type="password" placeholder="Conf MDP" required ref={(input) => { this.vpassInput = input}} />
          <button type="submit">GO</button>
        </form>
        </div>
      </div> 
    )
	}
}

export default Inscription;