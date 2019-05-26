import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { authUser } from '../../actions'
import './index.css'

class LogIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleFormSubmit(event) {
    event.preventDefault()
    this.props.dispatch(authUser(this.state))
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } }
    if (this.props.isAuthenticated) {
      return <Redirect to={from} />
    }

    return (
        <div className="connexion">
          <h1>Connexion</h1>
          <form onSubmit={this.handleFormSubmit} >
            <input type="text" name="username" placeholder="Pseudo" required value={this.state.username} onChange={this.handleInputChange}/><br />
            <input type="password" name="password" placeholder="Mot de passe" required value={this.state.password} onChange={this.handleInputChange}/>
            <button type="submit">Se connecter</button>
          </form>
          <Link to='/reset'>MDP oublié</Link>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const { isFetching, error, isAuthenticated } = state.userAuth

  return ({
    isFetching,
    error,
    isAuthenticated
  })
}

export default connect(mapStateToProps)(LogIn)