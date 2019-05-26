import React, { Component } from 'react'
import { connect } from 'react-redux'
import { delUserPicture, addUserPicture } from '../../actions/profil'
import Picture from '../../components/Picture'

class PicturesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPicture: 0
    }

    this.handlePictureDelete = this.handlePictureDelete.bind(this)
    this.prevPicture = this.prevPicture.bind(this)
    this.nextPicture = this.nextPicture.bind(this)
  }

  handlePictureDelete = rank => {
    this.props.dispatch(delUserPicture(rank))
  }

  handlePictureAdd = (picture, rank) => {
    this.props.dispatch(addUserPicture(picture, rank))
  }

  prevPicture = () => {
    if (this.state.currentPicture === 0) return
    else {
      this.setState({
        currentPicture: this.state.currentPicture - 1
      })
    }
  }

  nextPicture = () => {
    if (this.state.currentPicture === 
      (this.props.editable ? 4 : this.props.pictures.length - 1)) return
    else {
      this.setState({
        currentPicture: this.state.currentPicture + 1
      })
    }
  }

  render() {
    const pictures = [1, 2, 3, 4, 5].map(rank => {
      const picture = this.props.pictures ?
        this.props.pictures.filter(pic => pic.rank === rank)[0] : undefined
      if (picture) {
        return <Picture key={rank} 
                  data={picture.data}
                  rank={picture.rank}
                  id={picture.id} 
                  handlePictureDelete={this.props.editable ? this.handlePictureDelete : undefined}
                  handlePictureAdd={this.props.editable ? this.handlePictureAdd : undefined}
                  editable={this.props.editable}
              /> 
      } else {
        return <Picture key={rank}
                  data={null}
                  rank={rank}
                  handlePictureAdd={this.props.editable ? this.handlePictureAdd : undefined}                  
                  editable={this.props.editable}
              />
      }
    })
    const hidden = { visibility: 'hidden' }

    return (
      <div className="pictures-list">
          <button onClick={this.prevPicture} className="nav"
                  style={this.state.currentPicture ? undefined : hidden}>
            {'<'}
          </button>
        {pictures[this.state.currentPicture]}
        <button onClick={this.nextPicture} className="nav"
                style={this.state.currentPicture !== (this.props.editable ? 4 : this.props.pictures.length - 1) ? null : hidden }>
          {'>'}
        </button>
      </div>
    )
  }
}

export default connect()(PicturesList)