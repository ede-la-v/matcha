import React, { Component } from 'react'
import noPicture from './no-picture.png'
import Dropzone from 'react-dropzone'

class Picture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wantUpdate: false,
    }

    this.onDrop = this.onDrop.bind(this)
    this.upload = this.upload.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onDrop = (selectedFile) => {
    this.setState({ selectedFile })
  }

  upload = () => {
    if (!this.state.selectedFile) return
    this.props.handlePictureAdd(this.state.selectedFile[0], this.props.rank)
    this.setState({
      wantUpdate: false,
      selectedFile: undefined
    })
  }

  onDelete = () => {
    this.props.handlePictureDelete(this.props.rank)
  }

  render() {
    const { data, /*rank */} = this.props
    const img = data ? 
      <img src={`data:image/png;base64,${data}`} alt="user" /> :
      <img src={noPicture} alt="nothing to show" />
    const style = {
      background: data ? 
        `url(data:image/png;base64,${data}) 50% 50% / cover no-repeat` :
        `url(${noPicture}) 50% 50% / cover no-repeat`
    }

    return (
      <div className="picture-box" style={style}>
        <div className="picture-overlap">
          {this.props.editable &&
            <div>
              {!this.state.wantUpdate &&
                <button onClick={() => this.setState({ wantUpdate: true })}>Uploader</button>}
              {this.state.wantUpdate &&
                <button onClick={() => this.setState({ wantUpdate: false, selectedFile: undefined })}>Annuler</button>}
              <button onClick={this.onDelete}>Delete</button>
            </div>}
          {this.state.wantUpdate && 
            <Dropzone onDrop={this.onDrop} multiple={false}>
              Glisser un fichier ou cliquer pour selectionner
            </Dropzone>}
          {this.state.selectedFile && <button onClick={this.upload}>Envoyer</button>}
        </div>
      </div>
    )
  }
}

export default Picture