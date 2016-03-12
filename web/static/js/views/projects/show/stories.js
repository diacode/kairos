import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';

export default class ProjectsShowStories extends React.Component {
  _renderStories() {
    const { stories } = this.props;

    const items = stories.map((story) => {
      const { id, name } = story;

      return (
        <li key={story.id}>
          <strong>#{id}</strong> {name}
        </li>
      );
    });

    return (
      <ul className="stories-container">
        {items}
      </ul>
    );
  }

  render() {
    return (
      <div className="container">
        {::this._renderStories()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.currentProject }
);

export default connect(mapStateToProps)(ProjectsShowStories);
