import React, { Component } from 'react';
import { connect } from 'react-redux'
import { updateUser } from '../actions'

class Genre extends Component {
  constructor(props) {
    super(props)
    this.updateGender = this.updateGender.bind(this)
  }

  updateGender = input => {
    const gender = input

    fetch('/api/users/gender', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({
        gender
      })
    })
    .then(value => this.props.dispatch(updateUser({ gender })))
  }

  render() {
    return (
      <div>
        <h5>Je suis</h5>
        <div className="gender-box">
          <div  className={"gender " + (this.props.gender === 'homme' ? 'active' : '')}
                onClick={() => this.updateGender('homme')}>
            <i className="fa fa-mars fa-2x" aria-hidden="true"></i><br />
            Un homme
          </div>
          <div  className={"gender " + (this.props.gender === 'femme' ? 'active' : '')}
                onClick={() => this.updateGender('femme')}>
            <i className="fa fa-venus fa-2x" aria-hidden="true"></i><br />
            Une femme
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Genre);