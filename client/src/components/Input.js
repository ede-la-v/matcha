import React from 'react';

class Input extends React.Component {

  test = e => {
    this.value = this.valueInput.value;
  }

  render() {
    
    if (this.props.isHidden)
      return null;
    else
    {
      return (
        <div >
          <input id={this.props.id} type={this.props.type} ref={(input) => { this.valueInput = input}} />
        </div>
      )
    }
  }
}

export default Input;