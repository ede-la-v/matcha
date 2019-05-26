import React, { Component } from 'react'
import { connect } from 'react-redux'
import { readError } from '../../actions/error'

class Error extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.onDelete(this.props.id)
    }, 2000)
  }

  render() {
    return <p>Message: {this.props.message}. Id: {this.props.id}</p>
  }
}

class ErrorsList extends Component {
  constructor(props) {
    super(props)

    this.onDelete = this.onDelete.bind(this)
  }

  onDelete = (id) => {
    this.props.dispatch(readError(id))
  }

  render() {
    const errors = this.props.errorsList ? this.props.errorsList.map((error, index) => {
      return <Error key={error.id} id={error.id} message={error.message} onDelete={this.onDelete} />
    }) : undefined

    return <div>{errors}</div>
  }
}

function mapStateToProps(state) {
  const { errorsList } = state.error

  return { errorsList }
}

export default connect(mapStateToProps)(ErrorsList)
