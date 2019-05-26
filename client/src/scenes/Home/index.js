import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import 'react-rangeslider/lib/index.css'
import SearchTags from '../../components/SearchTags'
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import StarRatings from 'react-star-ratings';

import './index.css';
import { sort, firstMatching, saveMatching, updateMatching, updateFilter, updateAge, updatePop, updateDist, updateSearch, updatePage, useSave, newTag, selTag } from '../../actions/matching'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [], 
      isHidden: true,
      s_tags: [],
      sel_tags: [],
      sel_tags_tmp: [],
      genre: ["homme", "femme"],
      age: [18,100],
      pop: [0,1],
      distSearch: [0,20000],
      width: 0,
      test: 0
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    if (this.props.isAuthenticated && (!this.props.isMatching || this.props.bool) && this.props.user.bio && this.props.user.orientation && this.props.user.gender)
    {
      const headers = new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
        'Content-Type': 'application/json'
      })
      fetch('/api/me/suggestions', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({
          orientation: this.props.user.orientation,
          gender: this.props.user.gender
        })
      })
      
      .then(res => res.json())
      .then(users => {
        this.props.dispatch(firstMatching(users))
      })
    }
    else if (this.props.isAuthenticated)
    {
      var min = {pop: Math.min.apply(Math,this.props.users.map(function(o){return o.score;})), age: Math.max.apply(Math,this.props.users.map(function(o){return new Date(o.birthdate);}))}
      var max = {dist: Math.max.apply(Math,this.props.users.map(function(o){return o.dist;})), pop: Math.max.apply(Math,this.props.users.map(function(o){return o.score;})), age: Math.min.apply(Math,this.props.users.map(function(o){return new Date(o.birthdate);}))}
      this.setState({
        max, min
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  search = (e) => {
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      'Content-Type': 'application/json'
    })
    fetch('/api/users/search', {
      method: 'POST',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify({
        dist: this.state.distSearch[1],
        tags: this.props.sel_tags.join(),
        orientation: this.state.genre,
        age: this.state.age,
        score:this.state.pop,
        page: this.props.page
      })
    })
    
    .then(res => res.json())
    .then(users => {
      var min = {pop: Math.min.apply(Math,users.map(function(o){return o.score;})), age: Math.max.apply(Math,users.map(function(o){return new Date(o.birthdate);}))}
      var max = {dist: Math.max.apply(Math,users.map(function(o){return o.dist;})), pop: Math.max.apply(Math,users.map(function(o){return o.score;})), age: Math.min.apply(Math,users.map(function(o){return o.score;}))}
      this.props.dispatch(updatePage(this.props.page+1))
      this.setState({
        isHidden: true, min, max, age: [18,100], pop: [0,1], distSearch: [0,20000]
      })
      if (this.props.search === 2 && users.length)
        this.props.dispatch(updateMatching(this.props.users, users))
      else
        this.props.dispatch(saveMatching(users))
      this.props.dispatch(updateSearch(2))
    }
    )
  }
  distance = (e) => {
    var tmp = this.props.users2
    tmp.sort(function(a,b) {return (a.dist > b.dist) ? 1 : ((b.dist > a.dist) ? -1 : 0);} );
    this.props.dispatch(sort("distance"))
    this.props.dispatch(updateFilter(tmp))
  }

  matching = (e) => {
    
    var tmp = this.props.users2
    tmp.sort(function(a,b) {return (a.matching < b.matching) ? 1 : ((b.matching < a.matching) ? -1 : 0);} );
    this.props.dispatch(sort("matching"))
    this.props.dispatch(updateFilter(tmp))
  }

  tags = (e) => {
    var tmp = this.props.users2
    tmp.sort(function(a,b) {return (a.countsugg < b.countsugg) ? 1 : ((b.countsugg < a.countsugg) ? -1 : 0);} );
    this.props.dispatch(sort("tags"))
    this.props.dispatch(updateFilter(tmp))
    
  }

  pop = (e) => {
    var tmp = this.props.users2
    tmp.sort(function(a,b) {return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0);} );
    this.props.dispatch(sort("pop"))
    this.props.dispatch(updateFilter(tmp))
    
  }

  birthDate = (e) => {
    var tmp = this.props.users2
    tmp.sort(function(a,b) {return (new Date(a.birthdate) < new Date(b.birthdate)) ? 1 : ((new Date(b.birthdate) < new Date(a.birthdate)) ? -1 : 0);} );
    this.props.dispatch(sort("birthdate"))
    this.props.dispatch(updateFilter(tmp))
    
  }

  updateFilter = (type, data) => {
    var tags
    if (this.props.search === false)
      tags = this.state.tags;
    else
      tags = this.props.sel_tags_tmp;
    var age = this.props.age;
    var pop = this.props.pop;
    var dist = this.props.dist;
    if (type === "tags")
      tags = data;
    else if (type === "age")
      age = data;
    else if (type === "pop")
      pop = data;
    else if (type === "dist")
      dist = data;


    var filtered = this.props.users.filter(user => {
      for (var i = 0; i < tags.length; i++)
      {  
        var re = new RegExp(tags[i])
        if (user.concat === null || !user.concat.match(re))
          return false
      }
      return true
    })
    .filter(word => word.dist <= dist[1])
    .filter(word => {
        if (this.calculateAge(new Date(word.birthdate)) >= age[0] && this.calculateAge(new Date(word.birthdate)) <= age[1])
          return true
        else
          return false
    })
    .filter(word => {
        if (word.score >= pop[0] && word.score <= pop[1])
          return true
        else
          return false
    })
    /*if (this.state.sort === "matching")
      filtered.sort(function(a,b) {return (a.matching < b.matching) ? 1 : ((b.matching < a.matching) ? -1 : 0);} );
    if (this.state.sort === "matching")
    if (this.state.sort === "matching")
    if (this.state.sort === "matching")
    if (this.state.sort === "matching")*/
    return filtered;
  }

  updateTags = (e) => {
    var tmp = this.state.tags;
    var tmp2 = tmp.filter(word => word === e.target.value)
    if (tmp2.length === 0)
      tmp.push(e.target.value)
    else 
      tmp = tmp.filter(word => word !== e.target.value)
    this.setState({
      tags: tmp 
    })
    this.props.dispatch(updateFilter(this.updateFilter("tags",tmp)))
  }

  updateTags2 = (e) => {
    if (this.props.search === 2)
    {
      var tmp = this.props.sel_tags_tmp;
      var tmp2 = tmp.filter(word => word === e.target.value)
      if (tmp2.length === 0)
        tmp.push(e.target.value)
      else 
        tmp = tmp.filter(word => word !== e.target.value)
      this.props.dispatch(selTag(tmp))
      this.props.dispatch(updateFilter(this.updateFilter("tags",tmp)))
    }
  }

  searchTags = event => {

    if (event.target.value.length < 2 || event.target.value.length > 50)
      this.setState({isHidden: true});
    else
    {
      this.setState({isHidden: false});
      fetch('/api/tags/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          input: event.target.value
        })
      })
      .then(res => res.json())
        .then(s_tags => {
            this.setState({s_tags: s_tags});
          })
        .catch((error) => {
      });
    }

  }

  getExistingTag = event => {

    if (!this.props.sel_tags.filter(word => word === event.target.textContent.substr(1)).length)
    {
      this.searchInput.value = ""
      this.props.dispatch(updateSearch(1))
      this.props.dispatch(newTag(event.target.textContent.substr(1)))
      this.setState({ isHidden: true })
    }
  }

  genre = event => {
    if (this.state.genre.filter(word => word === event.target.value).length)
      this.setState({ genre: this.state.genre.filter(word => word !== event.target.value), search: 1 })
    else
    {
      var  tmp = this.state.genre;
      tmp.push(event.target.value)
      this.setState({ genre: tmp, search: 1 })
    }
  }

  age = e => {
    this.props.dispatch(updateFilter(this.updateFilter("age",e)))
    this.props.dispatch(updateAge(e))
  }

  calculateAge = birthday => { 
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  popu = e => {
    this.props.dispatch(updateFilter(this.updateFilter("pop",e)))
    this.props.dispatch(updatePop(e))
  }

  dist = e => {
    var tmp = e
    tmp[0] = 0;
    this.props.dispatch(updateFilter(this.updateFilter("dist",e)))
    this.props.dispatch(updateDist(tmp))    
  }

  ageSearch = event => {
    this.setState({ age: event })
  }

  popSearch = event => {
    this.setState({ pop: event })
  }

  distSearch = e => {
    var tmp = e
    tmp[0] = 0;
    this.setState({ distSearch: tmp })
  }

  openSearch = event => {
    this.props.dispatch(useSave(this.props.save))
    this.props.dispatch(updateSearch(1))
  }

  deleteSearch = e => {
    this.props.dispatch(useSave(this.props.save))
    this.props.dispatch(updateSearch(false))
  }

  render() {
    const { user, tagList, users, users2 } = this.props
    const len = users2.length
    const lenOri = users.length


    //if (this.profilsInput.width)
    //  var test = this.profilsInput.width
    
    if (!user || (Object.keys(user).length === 0 && user.constructor === Object))
      return <h2>Veuillez vous connectez ou vous inscrire pour matcher</h2>
    else if (!user.bio || !user.orientation || !user.gender) {
      return <h2>Votre profil n'est pas complet. Direction votre profil afin de pouvoir matcher!</h2>
    }
    if (!users.length && this.props.isMatching) {
      return (
        <div className="buttons">
          <button onClick={(e) => this.openSearch(e)}>Recherche avancée</button>
          <button onClick={(e) => this.deleteSearch(e)}>Suggestions</button>
          <h2>Pas de resultat</h2>
        </div>
      )
    }
    else if (!users.length) {
      return <h2>Chargement...</h2>
    }

    return (
      <div>
        <div className="buttons">
          <button onClick={(e) => this.openSearch(e)}>Recherche avancée</button>
          <button onClick={(e) => this.deleteSearch(e)}>Suggestions</button>
        </div>
        {this.props.search === 1 && <div className="search-box">
          <input checked={this.state.genre.filter(word => word === "homme").length?true:false} type="checkbox" value="homme" onChange={(e) => this.genre(e)} />Homme
          <input checked={this.state.genre.filter(word => word === "femme").length?true:false} type="checkbox" value="femme" onChange={(e) => this.genre(e)} />femme
          
          <form onSubmit={(e) => this.newTag(e)}>
              <input type='text' onChange={(e) => this.searchTags(e)} ref={(input) => { this.searchInput = input}} />
          </form>
          <SearchTags isHidden={this.state.isHidden} tags={this.state.s_tags} func={this.getExistingTag} />
          <ul>
            {this.props.sel_tags.map((tag, key) => (
              <li key={key}><input checked={this.props.sel_tags_tmp.filter(word => word === tag).length?true:false} type="checkbox" onChange={(e) => this.updateTags2(e)} value={tag} />{tag}</li>
            ))}
          </ul>
          {this.props.search !== 2 && <div>
          <div>
            Age ({this.state.age[0]} - {this.state.age[1]})
            <Range defaultValue={[18,100]} min={18} onChange={(e) => this.ageSearch(e)}/> 
          </div><br/>
          <div>
            Popularité ({(this.state.pop[0]*5).toFixed(1)}<span className="star"> ★</span> - {(this.state.pop[1]*5).toFixed(1)}<span className="star"> ★</span>)
            <Range defaultValue={[0,1]} step={0.01} max={1} onChange={(e) => this.popSearch(e)}/> 
          </div><br/>
          <div>
            Distance ({Math.round(this.state.distSearch[0])} - {Math.round(this.state.distSearch[1])})
            <Range defaultValue={[0,20000]} value={this.state.distSearch} min={0} step={20000/100} max={20000} onChange={(e) => this.distSearch(e)}/> 
          </div>
          </div>}
          <input type="submit" value="search" onClick={(e) => this.search(e)} /><br />
        </div>}
        {this.props.search !== 1 && <div className="search-box">
          
          sort by: 
        <input type="submit" value="matching" onClick={(e) => this.matching(e)} />
        <input type="submit" value="distance" onClick={(e) => this.distance(e)} />
        <input type="submit" value="tags" onClick={(e) => this.tags(e)} />
        <input type="submit" value="popularite" onClick={(e) => this.pop(e)} />
        <input type="submit" value="date de naissance" onClick={(e) => this.birthDate(e)} />
          <br/>
          
          filter by: 
          <div>
            Age ({this.props.age[0]} - {this.props.age[1]})
            <Range
              step={1}
              value={[this.props.age[0], this.props.age[1]]}
              min={18}
              max={100}
              onChange={(e) => this.age(e)}
            /> 
          </div>
          <div>
            Popularité ({(this.props.pop[0]*5).toFixed(1)}<span className="star"> ★</span> - {(this.props.pop[1]*5).toFixed(1)}<span className="star"> ★</span>)
            <Range 
              value={[this.props.pop[0], this.props.pop[1]]}
              step={0.01}
              min={0}
              max={1}
              onChange={(e) => this.popu(e)}
            /> 
          </div>
          <div>
            Distance (0 - {Math.round(this.props.dist[1])})
            <Range
              value={[0, this.props.dist[1]]}
              min={0}
              step={this.props.max.dist/100}
              max={this.props.max.dist}
              onChange={(e) => this.dist(e)}
            />
          </div>
          Total: {lenOri} Filtered: {len}
          <div id="sTags">
          {this.props.search === 2 && <ul>
              {this.props.sel_tags.map((tag, key) => (
                <li key={key}><input checked={this.props.sel_tags_tmp.filter(word => word === tag).length?true:false} type="checkbox" onChange={(e) => this.updateTags2(e)} value={tag} />{tag}</li>
              ))}
            </ul>}
          {!this.props.search && <ul>
            {tagList.map(tag => (
              <li key={tag.id}><input checked={this.state.tags.filter(word => word === tag.label).length?true:false} type="checkbox" onChange={(e) => this.updateTags(e)} value={tag.label} />{tag.label}</li>
            ))}
          </ul>}
          </div>
        </div>}
        
        
        <div ref={(input) => { this.profilsInput = input}}>
        <ul id="profils"   >
          {users2.map((user, key) => (
            <li key={user.suggid} id={key} className="profil">
              <Link to={`profil/${user.suggid}`} >
                <div className="card-square" style={{background: `url(data:image/png;base64,${user.data}) 50% 50% / cover no-repeat`}}>
                </div>
                <h1> {user.username}</h1>
                <div>{user.gender === 'femme' ? <i className="fa fa-venus" aria-hidden="true"></i> : <i className="fa fa-mars" aria-hidden="true"></i>} {this.calculateAge(new Date(user.birthdate))} ans</div>
                <StarRatings
                  rating={user.score*5}
                  starDimension={"15px"}
                  starRatedColor="rgb(178, 0, 0)"
                />
                <div id="res">
                  <div className="elem" >{Math.round(user.dist)+"km"}</div>
                  <div className="elem" >{user.countsugg?user.countsugg:0} tags</div>
                </div>
                <div className="profile-tags">
                  {user.concat?user.concat.split(" ").map((tag, key) => (
                    <span key={key}>{"#"+tag} </span>
                  )):false}
                </div>
                {user.likedMe && !user.isLiked ? <i className="fa fa-heart-o fa-2x red-heart" aria-hidden="true"></i> : null}
                {user.isLiked && !user.likedMe ? <i className="fa fa-heart fa-2x red-heart" aria-hidden="true"></i> : null}
                {user.isLiked && user.likedMe ? <i className="fa fa-heart fa-2x gold-heart" aria-hidden="true"></i> : null}
              </Link>
            </li>
          ))}
        </ul>
        </div>
        {this.props.page < 10 && this.props.search === 2 && lenOri === 100 && <input type="submit" value="more" onClick={(e) => this.search(e)} />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { isAuthenticated, user } = state.userAuth
  const { tagList } = state.tags
  const { sort, users, users2, isMatching, age, pop, dist, search, page, min, max, save, sel_tags, sel_tags_tmp, bool } = state.matching

  return {
    isAuthenticated,
    user,
    tagList,
    users,
    isMatching, 
    users2,
    age,
    pop,
    dist,
    search,
    page,
    min,
    max, 
    save,
    sel_tags, 
    sel_tags_tmp,
    bool,
    sort
  }
}

export default connect(mapStateToProps)(Home)