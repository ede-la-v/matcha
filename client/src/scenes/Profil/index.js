import React, { Component } from 'react';
import Genre from '../../components/Genre';
import Orientation from '../../components/Orientation';
import Bio from '../../components/Bio';
import PicturesList from '../PicturesList'
import TagsList from '../TagsList';
import { connect } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom'

class Profil extends Component {
  render() {
    const { user } = this.props
    if (!this.props.isAuthenticated) {
      return <Redirect to={"/connexion"} />
    }

      return (
        <div className="profile-box">
            <PicturesList pictures={this.props.pictures} editable={true} />
            <div className="info-box">
              <div className="info-box-inner">
                <h2>{user.username}, {~~((Date.now() - new Date(user.birthdate)) / (31557600000))}</h2>
                <Genre gender={user.gender} />
                <Orientation orientation={user.orientation} />
                <Bio bio={user.bio} />
                <TagsList tags={this.props.tagList} isEditable={true}/>
                <NavLink to={"profil/infos"}><button>Mes infos persos</button></NavLink>
              </div>
            </div>
        </div>
      )
  }
}

function mapStateToProps(state) {
  const { user, isAuthenticated } = state.userAuth
  const { pictures } = state.pictures
  const { tagList } = state.tags

  return { user, pictures, tagList, isAuthenticated }
}

export default connect(mapStateToProps)(Profil);