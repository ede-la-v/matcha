import React from 'react';
import { connect } from 'react-redux'
import { updateUser } from '../../actions'
import { Redirect } from 'react-router-dom'
import { change } from '../../actions/matching'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchWrap } from '../../services/fetchWrap'
import './index.css'

class Infos extends React.Component {

  state = { isHidden: "", error:[] }

  disUsername = e => {
    this.setState({ isHidden: "username", error: [] })
  }

  disEmail = e => {
    this.setState({ isHidden: "email", error: [] })
  }

  disFirstname = e => {
    this.setState({ isHidden: "firstname", error: [] })
  }

  disLastname = e => {
    this.setState({ isHidden: "lastname", error: [] })
  }

  disPass = e => {
    this.setState({ isHidden: "password", error: [] })
  }

  disAddress = e => {
    this.setState({ isHidden: "address", error: []})
  }

  change = e => {
    
    e.preventDefault();
    var info;
    if (this.state.isHidden === "username")
        info = this.usernameInput.value;
    if (this.state.isHidden === "email")
        info = this.emailInput.value;
    if (this.state.isHidden === "firstname")
      info = this.firstnameInput.value;
    if (this.state.isHidden === "lastname")
      info = this.lastnameInput.value;
    if (this.state.isHidden === "password")
      info = this.passInput.value;
    if (this.state.error.length === 0)
    {
        fetchWrap('/api/me/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          input: info,
          type: this.state.isHidden
        })
      })
      .then(() => {
        if (this.state.isHidden !== "password")
        {
          if (this.state.isHidden === "username")
            this.props.dispatch(updateUser({ username: info }))
          if (this.state.isHidden === "email")
            this.props.dispatch(updateUser({ email: info }))
          if (this.state.isHidden === "firstname")
            this.props.dispatch(updateUser({ firstname: info }))
          if (this.state.isHidden === "lastname")
            this.props.dispatch(updateUser({ lastname: info }))
        }
        if (this.state.isHidden === "username")
          this.usernameInput.value = "";
        if (this.state.isHidden === "email")
            this.emailInput.value = "";
        if (this.state.isHidden === "firstname")
          this.firstnameInput.value = "";
        if (this.state.isHidden === "lastname")
          this.lastnameInput.value = "";
        if (this.state.isHidden === "password")
        {
          this.passInput.value = "";
          this.vpassInput.value = "";
        }
      })
      .catch((error) => {
        if (error && error.message)
          NotificationManager.error(error.message, 'Erreur!', 5000, () => {});
      });
    }
    else
       NotificationManager.error(this.state.error, 'Erreur!', 5000, () => {});
  }

  newAddress = (e) => {

    e.preventDefault();
    fetchWrap('/api/geolocate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({
        type: "form",
        address: this.addInput.value,
        city: this.cityInput.value,
        country: this.countryInput.value
      })
    })
    .then(loc => {
        this.props.dispatch(updateUser(loc))
        this.addInput.value = '';
        this.cityInput.value = '';
        this.countryInput.value = '';
        this.props.dispatch(change(true))
    })
    .catch((error) => {
        if (error && error.message)
          NotificationManager.error(error.message, 'Erreur!', 5000, () => {});
      });
  }

  verif = (e) => {
    if (e.target.id === "password2")
    {
      var value = this.vpassInput.value;
      var same = this.vpassInput.value === this.passInput.value
      var number = value.match(/[0-9]+/)
      var length = value.match(/.{8,20}/)
      var char = value.match(/[a-zA-Z]+/)
      if (length !== null && number !== null && char !== null && same)
        this.setState({error:[]})
      if (!same)
        this.setState({ error: ["Les deux MDP doivent etre identiques"] })
      if (length === null || number === null || char === null)
        this.setState({ error: ["8 characteres minimum avec au moins une lettre et un chiffre."] })
       
    }
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to={"/connexion"} />
    }
      
        if (this.props.isAuthenticated) 
        {
          return (
        <div className="connexion">
          <h1>Mes infos</h1>
          <form onSubmit={(e) => this.change(e)}>
            <label onClick={(e) => this.disUsername(e)} >Pseudo: <span>{this.props.user.username}</span></label><br/>
            {this.state.isHidden === "username" && <input type="text" placeholder={this.props.user.username} ref={(input) => { this.usernameInput = input}} required />}<br/>
            {this.state.isHidden === "username" && <button  type="submit">Modifier le pseudo</button>}            
          </form>
          <form onSubmit={(e) => this.change(e)}>
            <label onClick={(e) => this.disEmail(e)} >Email: <span>{this.props.user.email}</span></label><br/>
            {this.state.isHidden === "email" && <input type="email" placeholder={this.props.user.email} ref={(input) => { this.emailInput = input}} required />}<br/>
            {this.state.isHidden === "email" && <button  type="submit">Modifier l'email</button>}            
          </form>
          <form onSubmit={(e) => this.change(e)}> 
            <label onClick={(e) => this.disFirstname(e)}>Prénom: <span>{this.props.user.firstname}</span></label><br/>
            {this.state.isHidden === "firstname" && <input placeholder={this.props.user.firstname} type="text" ref={(input) => { this.firstnameInput = input}} required />}<br/>
            {this.state.isHidden === "firstname" && <button  type="submit">Modifier le prénom</button>}            
          </form>
          <form onSubmit={(e) => this.change(e)} >
            <label onClick={(e) => this.disLastname(e)} >Nom: <span>{this.props.user.lastname}</span></label><br/>
            {this.state.isHidden === "lastname" && <input type="text" placeholder={this.props.user.lastname} ref={(input) => { this.lastnameInput = input}} required />}<br/>
            {this.state.isHidden === "lastname" && <button  type="submit">Modifier le nom</button>}
          </form>
          <form onSubmit={(e) => this.change(e)}>
            <label onClick={(e) => this.disPass(e)} >Mot de passe: </label><br/>
            {this.state.isHidden === "password" && <input id="password" placeholder="Mot de passe" type="password" ref={(input) => { this.passInput = input}} />}<br/>
            {this.state.isHidden === "password" && <input id="password2" placeholder="Vérification mot de passe" onChange={(e) => this.verif(e)} type="password" ref={(input) => { this.vpassInput = input}} />}
            {this.state.isHidden === "password" && <button  type="submit">Modifier le mot de passe</button>}
          </form>
          <form onSubmit={(e) => this.newAddress(e)}>
            <label onClick={(e) => this.disAddress(e)}>Adresse actuelle: <span>{this.props.user.address}</span></label>
            {this.state.isHidden === "address" && <input placeholder="96 bd Bessières" type="text" ref={(input) => { this.addInput = input}} required />}
            {this.state.isHidden === "address" && <input placeholder="Paris" type="text" ref={(input) => { this.cityInput = input}} required />}
            {this.state.isHidden === "address" && <input placeholder="France" type="text" ref={(input) => { this.countryInput = input}} required />}
            {this.state.isHidden === "address" && <button  type="submit">Modifier l'adresse</button>}
          </form>
          <NotificationContainer/>
        </div>
      )}
      else
        return null;
    
  }
}

function mapStateToProps(state) {
  const { user, isAuthenticated } = state.userAuth

  return ({
    user,
    isAuthenticated
  })
}

export default connect(mapStateToProps)(Infos);