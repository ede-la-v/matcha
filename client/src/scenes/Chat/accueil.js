import React from 'react'
import { connect } from 'react-redux'
import { getConvs, searchConv } from '../../actions/chat'
import 'react-chat-elements/dist/main.css';
import {ChatList} from 'react-chat-elements';
import { Redirect } from 'react-router-dom';
import SearchMatchs from '../../components/SearchMatchs';

class ChatInd extends React.Component {

  state = { redirect: 0, isHidden: true }

  componentDidMount(){
    this.props.dispatch(getConvs())
  }

  goToChat = (e) => {
    this.setState({ redirect: e.id })
  }

  searchConv = (e) => {
    this.setState({isHidden:false})
    if (this.matchInput.value.length > 1)
      this.props.dispatch(searchConv(this.matchInput.value))
    else
      this.setState({isHidden:true})

  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to={"/connexion"} />
    }
    const convs = this.props.convs
      .map((item, key) => ({key: key,
                            id: item.id,
                            alt: item.username,
                            title: item.username,
                            subtitle: item.message,
                            date: new Date(item.add_datef),
                            unread: typeof item.nonVu === 'undefined'? 0:item.nonVu,
                            avatar: 'https://thesocietypages.org/socimages/files/2009/05/nopic_192.gif'
                          })
      );

      if (this.state.redirect) {
        return <Redirect to={'/chat/'+this.state.redirect} />
      }

      return (
        <div>
        Chercher une conversation:<br />
          <input type="text" name="match" onChange={(e) => this.searchConv(e)} ref={(input) => { this.matchInput = input}} />
          <SearchMatchs isHidden={this.state.isHidden} matchs={this.props.isMatchs?this.props.matchs:[]} func={this.goToChat} />
          <ChatList
            className="chat-list"
            dataSource={convs}
            onClick= {(e) => this.goToChat(e)}
          />
        </div>
        
      )
    
  }
}

function mapStateToProps(state) {
  const { user, isAuthenticated } = state.userAuth
  const { socket, isConnect } = state.connectSocket
  const { convs, isConvs } = state.getConvs
  const { matchs, isMatchs } = state.searchMatchs

  return ({
    user,
    isAuthenticated,
    socket,
    isConnect, 
    convs,
    isConvs, 
    matchs,
    isMatchs
  })
}

export default connect(mapStateToProps)(ChatInd);