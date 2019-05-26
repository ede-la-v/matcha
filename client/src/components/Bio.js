import React from 'react';
import { connect } from 'react-redux'
import { updateUser } from '../actions'
import { fetchWrap } from '../services/fetchWrap'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class Genre extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bio: '',
    }
    this.updateBio = this.updateBio.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  updateBio = e => {
    e.preventDefault()
    const bio = this.state.bio

    fetchWrap('api/users/bio', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({
        bio
      })
    })
    .then(value => this.props.dispatch(updateUser({ bio })))
    .catch(error => {
      if (error && error.message)
        NotificationManager.error(error.message, 'Erreur!', 5000, () => {});
      else
        NotificationManager.error("", 'Erreur!', 5000, () => {});
    })
  }

  componentDidMount() {
    this.setState({
      bio: this.props.bio || 'Donne aux autres l\'envie d\'en savoir plus à ton sujet'
    })
  }

  handleInputChange = e => {
    this.setState({
      hasChanged: true,
      bio: e.target.value
    })
  }

  render() {
    const buttonStyle = {
      display: this.state.bio && this.state.hasChanged && this.state.bio.length > 10 ? 'block' : 'none'
    }
    return (
      <form onSubmit={this.updateBio}>
        <h5>A propos</h5>
        <NotificationContainer/>
        <textarea rows="4" onChange={this.handleInputChange} value={this.state.bio} maxLength="250">
        </textarea>
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    )
  }
}

export default connect()(Genre)