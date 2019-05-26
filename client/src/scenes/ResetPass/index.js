import React from 'react';
import { fetchWrap } from '../../services/fetchWrap'
import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Connexion extends React.Component {

  sendMail = event => {
    event.preventDefault();
    // On change d'url
    fetchWrap('/api/me/reset', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: this.pseudoInput.value
      })
    })
    .then(res => NotificationManager.success("Un mail pour reinitialiser votre MDP vous a ete envoye!!", 'Reinitialisation', 5000, () => {}))
      .catch((error) => {
         if (error && error.message)
          NotificationManager.error(error.message, 'Error', 5000, () => {});
        else
          NotificationManager.error("", 'Error', 5000, () => {});
        });
  }


  render() {
    return (
      <div className="connexion">
        <form onSubmit={(e) => this.sendMail(e)} >
          <input type="text" placeholder="Pseudo" required ref={(input) => { this.pseudoInput = input}} />
          <button type="submit">Réinitialiser le MDP</button>
        </form>
      </div>
    )
  }
}

export default Connexion;
