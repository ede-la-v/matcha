import React from 'react';

class SearchMatchs extends React.Component {

  render() {
    
    const matchs = this.props.matchs
      .map((item, key) => <div key={key} onClick={(e) => this.props.func(item)} >{item.username}</div>);

    if (this.props.isHidden)
      return null;
    else
    {
      return (
        <div >
          {matchs}
        </div>
      )
    }
  }
}

export default SearchMatchs;