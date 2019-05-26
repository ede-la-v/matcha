import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tag from './Tag'

class TagsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isHidden: true,
      s_tags: []
    }
  }

  render() {
    const tags = this.props.tags ?
      this.props.tags.map(tag => 
        <Tag  key={tag.id} 
              label={tag.label}
              id={tag.id}
        />) :
      undefined

    return (
      <div>
        <h2>TAGS</h2>
        {tags}
      </div>
    )
  }
}


export default connect()(TagsList)