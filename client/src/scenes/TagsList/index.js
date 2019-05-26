import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTag, delTag } from '../../actions/tags'
import SearchTags from '../../components/SearchTags'
import { change } from '../../actions/matching'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchWrap } from '../../services/fetchWrap'

class TagsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isHidden: true,
      s_tags: []
    }
  }

  newTag = event => {
    event.preventDefault()
    var filter = this.props.tags.filter(tag => tag.label !== this.searchInput.value)
    if (this.searchInput.value.indexOf(" ") !== -1 || this.searchInput.value.length <= 1 || filter.length !== this.props.tags.length)
    {
      if (this.searchInput.value.indexOf(" ") !== -1)
      {NotificationManager.error('Pas d\'espace dans le tag', 'Erreur!', 5000, () => {});}
      if (this.searchInput.value.length <= 1)
        NotificationManager.error('Le tag doit contenir au moins 2 charcateres..', 'Erreur!', 5000, () => {});
      if (filter.length !== this.props.tags.length)
        NotificationManager.error('Tag deja present..', 'Erreur!', 5000, () => {});
    }
    else
    {
      this.setState({isHidden: true});
      fetchWrap('/api/me/tags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          input: this.searchInput.value
        })
      })
      .then((tag) => {
        this.props.dispatch(addTag(tag))
        this.props.dispatch(change(true))
        this.searchInput.value = ""
      })
        .catch((error) => {
          if (error && error.message)
            NotificationManager.error(error.message, 'Erreur!', 5000, () => {});
        });
      
    }

  }

  searchTags = event => {

    if (event.target.value.length < 2)
      this.setState({isHidden: true});
    else
    {
      this.setState({isHidden: false});
      fetchWrap('/api/tags/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          input: event.target.value
        })
      })
        .then(s_tags => {
            this.setState({s_tags: s_tags});
          })
        .catch((error) => {
          if (error && error.message)
            NotificationManager.error(error.message, 'Erreur!', 5000, () => {});
        });
    }

  }

  handleDelete = event => {
    var id = event.target.id
    if (window.confirm("Voulez vous supprimer le tag?"))
    {
      fetchWrap('/api/me/tags/'+id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
        .then(() => {
            this.props.dispatch(delTag(id))
            this.props.dispatch(change(true))
          })
        .catch((error) => {
          NotificationManager.error("Le tag n'a pas pu etre supprime", 'Erreur!', 5000, () => {});
        });
    }
  }

  getExistingTag = event => {
    this.searchInput.value = event.target.textContent.substr(1);
    this.newTag(event)
  }

  render() {
    const tags = this.props.tags ?
      this.props.tags.map(tag => 
        <div  key={tag.id} 
              id={tag.id}
              onClick={this.props.isEditable ? this.handleDelete : () => { return }}
              className="tag"
        >{tag.label}</div>) :
      undefined

    return (
      <div>
        <h5>Mes intérêts</h5>
        <NotificationContainer/>
        {tags}
        {this.props.isEditable && <div className="new-tag"><h6>Nouveau tag</h6>
        <form onSubmit={(e) => this.newTag(e)}>
          <input type='text' onChange={(e) => this.searchTags(e)} ref={(input) => { this.searchInput = input}} />
        </form>
        <SearchTags isHidden={this.state.isHidden} tags={this.state.s_tags} func={this.getExistingTag} /></div>}
      </div>
    )
  }
}


export default connect()(TagsList)