import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import './style.css'
import { vuNotifsUser, clickNotifsSuccess } from '../../actions/notifs'
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/fontawesome-free-solid';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import 'simplebar'
import 'simplebar/dist/simplebar.css';
import relativeDate from 'relative-date'

class Navbar extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      notif: false
    }
  }

  handleClickOutside = (event) => {
      var notif = document.getElementById('notif');
      if (notif && !notif.contains(event.target)) {
         this.setState({ notif: false })
         document.removeEventListener('mousedown', this.handleClickOutside);
      }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated)
      NotificationManager.success('Vous etes maintenant connecte', 'Bonjour '+nextProps.user.firstname);
    if (this.props.countNotif !== nextProps.countNotif && nextProps.countNotif !== 0 && this.props.isNotif === nextProps.isNotif)
    {
      if (nextProps.notif[0].type === "view")
        NotificationManager.info(nextProps.notif[0].username+' a vu votre profil', 'Notifications');
      if (nextProps.notif[0].type === "like")
        NotificationManager.info(nextProps.notif[0].username+' vous a liké', 'Notifications');
      if (nextProps.notif[0].type === "unlike")
        NotificationManager.info(nextProps.notif[0].username+' ne vous like plus', 'Notifications');
      if (nextProps.notif[0].type === "likeb")
        NotificationManager.info(nextProps.notif[0].username+' vous a liké en retour, it\'s a match', 'Notifications');
    }
    if (this.props.count !== nextProps.count && nextProps.count !== null && nextProps.count !== 0 && window.location.href.indexOf("chat") === -1)
      NotificationManager.info(nextProps.count+' messages non lus', 'Nouveau message');
  }

  notif = (e) => {
    if (!this.state.notif)
    {
      this.setState({ notif: true })
      document.addEventListener('mousedown', this.handleClickOutside);
    }
    if (this.props.notif.length > 0)
      this.props.dispatch(vuNotifsUser())
  }

  redirect = (e) => {
    var notif = this.props.notif;
    notif[e].vu = 1
    this.props.dispatch(clickNotifsSuccess(notif))
    this.setState({ notif: false })

  }


  render() {
    const notifs = this.props.notif
    .map((item, key) => {
      if (item.type === "view")
        return <NavLink exact activeClassName="active" key={key} to={"/profil/"+item.id_notifier}><div className={"elem2 "+(Number(item.vu) === 0?"new":"")} onClick={() => this.redirect(key)} key={key} ><div className={Number(item.vu) === 0?"notif":"notifO"}><FontAwesomeIcon icon={faBell} /></div><div className={Number(item.vu) === 0?"text_notif":"text_notifO"}><div >{item.username+" a vu votre profil "}</div><div className="datere">{relativeDate(new Date(item.add_date))}</div></div></div></NavLink>
      else if (item.type === "like")
        return <NavLink exact activeClassName="active" key={key} to={"/profil/"+item.id_notifier}><div className={"elem2 "+(Number(item.vu) === 0?"new":"")} onClick={() => this.redirect(key)} key={key} ><div className={Number(item.vu) === 0?"notif":"notifO"}><FontAwesomeIcon icon={faBell}  /></div><div className={Number(item.vu) === 0?"text_notif":"text_notifO"}>{item.username+" vous a liké "}</div></div></NavLink>
      else if (item.type === "unlike")
        return <NavLink exact activeClassName="active" key={key} to={"/profil/"+item.id_notifier}><div className={"elem2 "+(Number(item.vu) === 0?"new":"")} onClick={() => this.redirect(key)} key={key} ><div className={Number(item.vu) === 0?"notif":"notifO"}><FontAwesomeIcon icon={faBell}  /></div><div className={Number(item.vu) === 0?"text_notif":"text_notifO"}>{item.username+" ne vous like plus "}</div></div></NavLink>
      else if (item.type === "likeb")
        return <NavLink exact activeClassName="active" key={key} to={"/chat/"+item.id_notifier}><div className={"elem2 "+(Number(item.vu) === 0?"new":"")} onClick={() => this.redirect(key)} key={key}><div className={Number(item.vu) === 0?"notif":"notifO"}><FontAwesomeIcon icon={faBell} /></div><div className={Number(item.vu) === 0?"text_notif":"text_notifO"}>{item.username+" vous a liké également..it's a match!! "}</div></div></NavLink>
      else
        return null;
    });
      
    return (
      <div>
      <ul className="navbar">
        <li className="matcha"><NavLink exact activeClassName="active" to="/">Matcha</NavLink></li>
        {this.props.isAuthenticated && <li className="navbar-center" onClick={(e) => this.notif(e)}>{this.props.countNotif}</li>}
        {this.props.isAuthenticated && <li className="navbar-center"><NavLink activeClassName="active" to="/chat">{this.props.count}</NavLink></li>}
        {!this.props.isAuthenticated && <li><NavLink activeClassName="active" to="/inscription"><i className="fa fa-user-plus" /> <span className="navtext">Inscription</span></NavLink></li>}
        {!this.props.isAuthenticated && <li className="navbar-right"><NavLink activeClassName="active" to="/connexion"><i className="fa fa-sign-in" /> <span className="navtext">Connexion</span></NavLink></li>}
        {this.props.isAuthenticated && <li><NavLink activeClassName="active" to="/profil"><i className="fa fa-user" /> <span className="navtext">{this.props.user.username}</span></NavLink></li>}
        {this.props.isAuthenticated && <li className="navbar-right"><NavLink activeClassName="active" to="/deconnexion"><i className="fa fa-sign-out" /> <span className="navtext">Deconnexion</span></NavLink></li>}
      </ul>
      {this.state.notif && <div id="notif" data-simplebar>{notifs}</div>}
      <NotificationContainer/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { isAuthenticated, user } = state.userAuth
  const { socket, isConnect } = state.connectSocket
  const { notif, isNotif } = state.notifSocket
  const countNotif = state.notifSocket.count
  const { count } = state.getMessagesUser



  return ({
    isAuthenticated,
    user,
    socket,
    isConnect,
    notif, 
    count,
    countNotif,
    isNotif
  })
}

export default connect(mapStateToProps)(Navbar)