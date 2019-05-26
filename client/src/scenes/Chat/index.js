import React from 'react'
import { connect } from 'react-redux'
import { getMessagesConv, newMess, getMessagesUser, searchConv  } from '../../actions/chat'
import './index.css';
import 'react-chat-elements/dist/main.css';
import {MessageBox} from 'react-chat-elements';
import { Redirect } from 'react-router-dom';

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      match: false,
      top: 0
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount(){
    this.props.dispatch(getMessagesConv(this.props.match.params.id))
    this.props.dispatch(getMessagesUser())
      this.props.dispatch(searchConv(""))
    if (this.props.isConnect)
    {  
      this.props.socket.on('message', () => {
        if (window.location.href.indexOf("chat") !== -1)
          this.props.dispatch(getMessagesConv(this.props.match.params.id))
      })
    }
  }

  componentDidUpdate(){
     this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  handleClick = event => {
    if (event.target.innerHTML === this.props.user.username) {
      this.props.history.push('/profil/')
    } else {
      this.props.history.push(`/profil/${this.props.match.params.id}`)
    }
  }

  handleFormSubmit = event => {
    event.preventDefault()
    if (this.state.match)
    {
      this.props.dispatch(newMess(this.messageInput.value, this.props.match.params.id))
      this.props.socket.emit("message", this.props.match.params.id);
    }
    this.messageInput.value = ""
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.matchs !== nextProps.matchs)
    {
      for (var i = 0; i < nextProps.matchs.length; i++)
      {
        if (Number(nextProps.matchs[i].id) === Number(this.props.match.params.id))
          this.setState({ match: true })

      }
    }
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to={"/connexion"} />
    }
    
    const messages = this.props.messages
      .map((item, key) => <MessageBox 
                            position={item.messaged === this.props.user.username ? 'left':'right'} 
                            key={key}
                            text={item.message}
                            title={item.messager}
                            date={new Date(item.add_date)}
                            onTitleClick={this.handleClick}
                            />
      );

      return (
        //<div >
          <div id="messages" ref={(div) => {
            this.messageList = div;
          }}>
            {messages}
            <div style={{ float:"left" }}
                 ref={(el) => { this.messagesEnd = el; }}>
            </div>
          <form className="chat-form" onSubmit={this.handleFormSubmit} >
            <input type="text" name="message" id="message" ref={(input) => { this.messageInput = input}} />
          </form>
        </div>
        
      )
    
  }
}

function mapStateToProps(state) {
  const { user, isAuthenticated } = state.userAuth
  const { socket, isConnect } = state.connectSocket
  const { messages, isMessages } = state.getConv
  const { matchs, isMatchs } = state.searchMatchs
  const { isCount } = state.getMessagesUser

  return ({
    user,
    socket,
    isConnect, 
    messages,
    isMessages,
    isAuthenticated,
    matchs, isMatchs, isCount
  })
}

export default connect(mapStateToProps)(Chat);