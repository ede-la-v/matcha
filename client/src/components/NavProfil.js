import React from 'react';

class NavProfil extends React.Component {

  state = {log: true}

  goToProfil = event => {
    event.preventDefault();
    this.context.router.transitionTo('/profil');
  }

  goToInfos = event => {
    event.preventDefault();
    this.context.router.transitionTo('/infos');
  }

  render() {

    return (
      <div >
        <a onClick={(e) => this.goToProfil(e)}>Profil</a>
        <a onClick={(e) => this.goToInfos(e)}>Infos Perso</a>
      </div>
    )
  }
}

export default NavProfil;