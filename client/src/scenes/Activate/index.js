import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

class Activate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActivated: false
    }
  }

  componentDidMount() {
    const headers = new Headers({
      "Content-Type": "application/json"
    });

    fetch('/api/me/activate', {
      method: 'POST',
      headers,
      credentials: 'same-origin',
      body: JSON.stringify({
        token: this.props.match.params.token,
      })
    })
    .then(() => this.setState({
      isActivated: true
    }), () => this.setState({
      isActivated: true
    }))
  }

  render() {
    if (this.state.isActivated) {
      return <Redirect to="/" />
    }
    return <h2>Loading...</h2>
  }
}

export default Activate