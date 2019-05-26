import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Navbar from './components/Navbar'
import Home from './scenes/Home'
import LogIn from './scenes/LogIn'
import LogOut from './scenes/LogOut'
import SignIn from './scenes/SignIn'
import Activate from './scenes/Activate'
import Profil from './scenes/Profil'
import ErrorsList from './scenes/ErrorsList'
import Chat from './scenes/Chat'
import ChatInd from './scenes/Chat/accueil'
import ProfilPub from './scenes/ProfilPub/index'
import Infos from './scenes/Infos/index'
import ResetPass from './scenes/ResetPass/index'
import NewPass from './scenes/NewPass/index'

class MatchaApp extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <main>
            <Navbar />
            <ErrorsList />
            <Route exact path="/" component={Home} />
            <Route path="/connexion" component={LogIn} />
            <Route path="/reset" component={ResetPass} />
            <Route path="/new/:token" component={NewPass} />
            <Route path="/inscription" component={SignIn} />
            <Route path="/deconnexion" component={LogOut} />
            <Route path="/activate/:token" component={Activate} />
            <Route exact path="/profil" component={Profil} />
            <Route path="/profil/:id([0-9].*)" component={ProfilPub} />
            <Route path="/profil/infos" component={Infos} />
            <Route exact path="/chat" component={ChatInd} />
            <Route path="/chat/:id" component={Chat} />
          </main>
        </Router>
      </Provider>
    )
  }
}

export default MatchaApp