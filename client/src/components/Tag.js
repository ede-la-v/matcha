import React, { Component } from 'react'

class Tag extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    if (this.props.isSelected) {
      this.props.onDelete(this.props.id)
    } else {
      this.props.onAdd(this.props.id)
    }
  }

  render() {
    return (<div onClick={this.handleClick}>{this.props.label} {this.props.isSelected && <span>YES</span>}</div>)
  }
}

export default Tag