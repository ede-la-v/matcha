import React from 'react';
import Connect from './Connect';

class Header extends React.Component {

  state = {log: true}

  goToApp = event => {
    event.preventDefault();
    this.context.router.transitionTo('/');
  }

  componentWillMount(){
    if (localStorage.getItem('conn'))
      this.setState({ log: true});
    else
      this.setState({ log: false});
 }

  render() {

    return (
      <header >
        <a onClick={(e) => this.goToApp(e)}>Accueil</a>
        <Connect log={this.state.log} />
      </header>
    )
  }
  static contextTypes = {
    router: React.PropTypes.object
  };
}

export default Header;