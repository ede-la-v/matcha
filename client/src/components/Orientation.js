import React, { Component } from 'react';
import { connect } from 'react-redux'
import { updateUser } from '../actions'
import { change } from '../actions/matching'

class Genre extends Component {
  constructor(props) {
    super(props)
    this.updateOrientation = this.updateOrientation.bind(this)
  }

  updateOrientation = input => {
    const orientation = input

    fetch('/api/users/orientation', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({
        orientation
      })
    })
    .then(value => {
        this.props.dispatch(updateUser({ orientation }))
        this.props.dispatch(change(true))
      })
  }

  render() {
    return (
      <div >
        <h5>Je cherche</h5>
        <div className="gender-box">
          <div  className={"gender " + (this.props.orientation === 'homme' ? 'active' : '')}
                onClick={() => this.updateOrientation('homme')}>
            <i className="fa fa-mars fa-2x" aria-hidden="true"></i><br />
            Un homme
          </div>
          <div  className={"gender " + (this.props.orientation === 'femme' ? 'active' : '')}
                onClick={() => this.updateOrientation('femme')}>
            <i className="fa fa-venus fa-2x" aria-hidden="true"></i><br />
            Une femme
          </div>
          <div  className={"gender " + (this.props.orientation === 'both' ? 'active' : '')}
                onClick={() => this.updateOrientation('both')}>
            <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i><br />
            Les deux
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Genre)