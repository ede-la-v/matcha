import React from 'react';
import './index.css';
import { connect } from 'react-redux'
import Like from '../../components/Like'
import PicturesList from '../PicturesList'
import TagsList from '../TagsList'
import { Redirect } from 'react-router-dom'
import { change } from '../../actions/matching'
import { fetchWrap } from '../../services/fetchWrap'
import {NotificationManager} from 'react-notifications';

class ProfilPub extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      likesMe: false,
      liked: false,
      pictures: [],
      tags: [],
      status: false,
      statusDate: null
    }
    this.handleLike = this.handleLike.bind(this)
  }

  handleLike = (e) => {
    
    const id = {
      notifier: this.props.user.id,
      notified: this.props.match.params.id
    }

    if (!this.state.liked)
    {
      fetch('/api/users/'+this.props.match.params.id+'/like', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then(res => {
        if (this.state.likesMe && this.props.isConnect)
          this.props.socket.emit('likeb', id);
        else if (this.props.isConnect)
          this.props.socket.emit('like', id);
        this.setState({liked: true})
        this.props.dispatch(change(true))
      });
    }
    else
    {
      fetch('/api/users/'+this.props.match.params.id+'/like', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then(res => {
        if (this.props.isConnect)
          this.props.socket.emit('unlike', id);
        this.setState({liked: false})
        this.props.dispatch(change(true))
      });
      
    }
    
  }

  componentWillMount() {
    fetchWrap(`/api/users/${this.props.match.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then(user => {
        this.setState({
        user: user.user,
        likesMe: user.likesMe,
        liked: user.liked,
        pictures: user.pictures,
        tags: user.tags
      })
      })
      .catch((error) => {
        if (error.error === "You do not have permission to see that user")
          this.props.history.push(`/`)
        else
          NotificationManager.error('', 'Error', 5000, () => {})
      });
  }

  componentDidMount(){
    const id = {
      notifier: this.props.user.id,
      notified: this.props.match.params.id
    }
    if (this.props.isConnect)
    {
      this.props.socket.on('conn', conn => {
       this.setState({ status: true })
      })
      this.props.socket.on('deconn', conn => {
          this.setState({ status: false })
          fetchWrap(`/api/users/${this.props.match.params.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
          })
            .then(user => {
              this.setState({
                user: user.user,
                likesMe: user.likesMe,
                liked: user.liked,
                pictures: user.pictures,
                tags: user.tags
              })
            })
            .catch((error) => {
              if (error.error === "You do not have permission to see that user")
                this.props.history.push(`/`)
              else
                NotificationManager.error('', 'Error', 5000, () => {})
            });
      })
      this.props.socket.on('status', conn => {
        this.setState({ status: conn })
      })
      this.props.socket.emit('view', id)
    }
  }

  block = () => {
    fetchWrap(`/api/users/${this.props.match.params.id}/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then(() => {
        this.props.dispatch(change(true))
        this.props.history.push(`/`)
      })
      .catch((error) => {
       if (error && error.message)
          NotificationManager.error(error.message, 'Error', 5000, () => {})
        else
          NotificationManager.error('', 'Error', 5000, () => {})
      });
  }

  signal = () => {
    fetchWrap(`/api/users/${this.props.match.params.id}/signal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then(() => {
        NotificationManager.success("Signalement bien pris en compte", 'Merci!')
      })
      .catch((error) => {
        if (error && error.message)
          NotificationManager.error(error.message, 'Error', 5000, () => {})
        else
          NotificationManager.error('', 'Error', 5000, () => {})
      });
  }


  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to={"/connexion"} />
    }
    const { user } = this.state
    const lastSeen = new Date(this.state.user.status)
    const stringLastSeen = `${lastSeen.getDate()}/${lastSeen.getMonth() + 1}/${lastSeen.getFullYear()} à ${lastSeen.getHours()}:${lastSeen.getMinutes()}`
    const distance = Math.sqrt(Math.pow(Math.abs(this.props.user.lat - this.state.user.lat)*111,2) + Math.pow(Math.abs(this.props.user.lon - this.state.user.lon)*111,2)).toFixed(0)

    if (user)
    {
      return (
        <div className="profile-box">
          <PicturesList pictures={this.state.pictures} />
          <div className="info-box">
            <div className="info-box-inner">
              <h2>{user.username}, {~~((Date.now() - new Date(user.birthdate)) / (31557600000))} <span className="distance">({distance} kms from you)</span></h2>
              <p className="info-text">{this.state.status ? "(en ligne)" : `Dernière connexion: ${stringLastSeen}`}</p>
              <p className="info-text">{user.firstname} {user.lastname} - {user.gender} recherche {user.orientation === 'both' ? 'homme et femme' : user.orientation}</p>
              {Number(this.props.match.params.id) !== this.props.user.id && this.props.pictures.length !== 0 && <Like onclick={this.handleLike} likesMe={this.state.likesMe} liked={this.state.liked} />}
              <h5>A propos</h5>
              <p className="info-text">{user.bio || 'Non renseigné'}</p>
              <TagsList tags={this.state.tags} isEditable={false}/>
              <div className="bad-box">
                {Number(this.props.match.params.id) !== this.props.user.id && <button className="bad" onClick={this.block}>Bloquer l'utilisateur</button>}
                {Number(this.props.match.params.id) !== this.props.user.id && <button className="bad" onClick={this.signal}>Signaler un faux compte</button>}
              </div>
            </div>
          </div>
        </div>
      )
    }
    else
      return <h2>Loading...</h2>
    
  }
}
function mapStateToProps(state) {
  const { socket, isConnect } = state.connectSocket
  const { user, isAuthenticated } = state.userAuth
  const { pictures } = state.pictures
  return ({
    socket,
    isConnect,
    user, 
    isAuthenticated,
    pictures
  })
}
export default connect(mapStateToProps)(ProfilPub)