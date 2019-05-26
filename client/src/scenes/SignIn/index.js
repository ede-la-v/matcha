import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchWrap } from '../../services/fetchWrap'
import './index.css'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password2: '',
      firstname: '',
      lastname: '',
      email: '',
      isSignedIn: false,
      startDate: null
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this) 
    this.handleChange = this.handleChange.bind(this)    
  }

  handleFormSubmit(e) {
    e.preventDefault();
    var error = []
    if (this.state.startDate === null || Date.now() - Date.parse(this.state.startDate) < 60*60*24*365*18*1000)
      error.push("Date invalide ou mineur")
    if (this.state.username.length < 4 || this.state.username.length > 20)
      error.push("Le pseudo doit contenir entre 4 et 20 caracteres")
    if (this.state.password.length < 8 || this.state.password.length > 20)
      error.push("Le MDP doit contenir entre 8 et 20 caracteres")
    if (this.state.firstname.length < 1 || this.state.firstname.length > 20)
      error.push("Le prenom doit contenir entre 1 et 20 caracteres")
    if (this.state.lastname.length < 1 || this.state.lastname.length > 30)
      error.push("Le nom doit contenir entre 1 et 30 caracteres")
    if (this.state.password.match(/[0-9]+/) === null)
      error.push("Le MDP doit contenir 1 chiffre")
    if (this.state.password.match(/[a-zA-Z]+/) === null)
      error.push("Le MDP doit contenir 1 lettre")
    if (this.state.password !== this.state.password2)
      error.push("Les 2 MDP sont differents")
    if (error.length === 0)
    {
      fetchWrap('api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: this.state.username,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.email,
          password: this.state.password,
          password2: this.state.password2,
          date: this.state.startDate.format('YYYY-MM-DD')
        })
      })
      .then(() => {
        NotificationManager.success("Vous avez bien été inscrit sur le site, un email d'activation vous a ete envoye a l'adresse indiquee!!", 'Inscription!', 5000, () => {});
        this.setState({
          isSignedIn: true
        })
      })
      .catch(error => {
        if (error && error.message)
          NotificationManager.error(error.message, 'Erreur!', 5000, () => {});
        else
          NotificationManager.error('', 'Erreur!', 5000, () => {});
      })
    }
    else
    {
      for (var i = 0; i < error.length; i++)
        NotificationManager.error(error[i], 'Erreur!', 5000, () => {});
    }
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
      
  render() {
    if (this.state.isSignedIn) {
      return <Redirect to="/" />
    }
    return (
      <div className="connexion">
        <h1>Inscription</h1>
        <form onSubmit={this.handleFormSubmit}>
          <input type="text" name="username" placeholder="Pseudo" required value={this.state.username} onChange={this.handleInputChange} /><br />
          <input type="text" name="firstname" placeholder="Prénom" required value={this.state.firstname} onChange={this.handleInputChange} /><br />
          <input type="text" name="lastname" placeholder="Nom" required value={this.state.lastname} onChange={this.handleInputChange} /><br />
          <input type="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleInputChange} /><br />
          <input type="password" name="password" placeholder="Mot de passe" required value={this.state.password} onChange={this.handleInputChange} /><br />
          <input type="password" name="password2" placeholder="Confirmation mot de passe" required value={this.state.password2} onChange={this.handleInputChange} />
          <Datepicker 
            selected={this.state.startDate}
            onChange={this.handleChange}
            showYearDropdown
            placeholderText="Date de naissance" />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    )
  }
}

export default SignIn
