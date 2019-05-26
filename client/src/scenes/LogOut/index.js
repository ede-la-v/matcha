import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { unauthUser } from '../../actions'

class LogOut extends Component {
  componentWillMount() {
    this.props.dispatch(unauthUser())
  }

  render() {
	window.location.reload()
    return <Redirect to="/" />
  }
}

export default connect()(LogOut)