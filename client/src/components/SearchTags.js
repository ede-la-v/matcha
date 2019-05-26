import React from 'react';

class SearchTags extends React.Component {

  render() {
    
    const tags = this.props.tags ?
    this.props.tags
      .map((item, key) => <div key={key} onClick={(e) => this.props.func(e)} >#{item.label}</div>): undefined;

    if (this.props.isHidden || this.props.tags.length === 0)
      return null;
    else
    {
      return (
        <div>
          {tags}
        </div>
      )
    }
  }
}

export default SearchTags;