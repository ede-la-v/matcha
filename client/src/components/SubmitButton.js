import React from 'react';

class SubmitButton extends React.Component {

  click = (e) => {

    this.props.onclick(this.props.value);
  }

  render() {
    
    if (this.props.isHidden)
      return null;
    else
    {
      return (
        <div onClick={(e) => this.click(e)} >
          {this.props.name}
        </div>
      )
    }
  }
}

export default SubmitButton;