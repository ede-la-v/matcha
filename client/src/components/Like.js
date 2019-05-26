import React, { Component } from 'react'

class Like extends Component {
  render() {
    const { likesMe, liked } = this.props
    let likeStatus

    if (likesMe && liked) {
      likeStatus = <p><i className="fa fa-thermometer-full" /> It's a match!</p>
    } else if (likesMe) {
      likeStatus = <p><i className="fa fa-thermometer-three-quarters" /> Like back!</p>
    } else if (liked) {
      likeStatus = <p><i className="fa fa-thermometer-three-quarters" /> Wait for that like back!</p>      
    } else {
      likeStatus = <p><i className="fa fa-thermometer-empty" /> Get that temperature up!</p>      
    }

    return (
      <button onClick={(e) => this.props.onclick(e)}>
        {likeStatus}
      </button>
    )
  }
}

export default Like