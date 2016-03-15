import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';
import { setDocumentTitle }      from '../../../utils';

export default class ProjectsShowStories extends React.Component {
  componentDidMount() {
    const { name } = this.props;

    setDocumentTitle(`${name} stories`);
  }

  _renderStories() {
    const { stories } = this.props;

    const items = stories.map((story) => {
      const { id, name, estimate } = story;
      const estimatedHours = this._estimatedHours(estimate);
      return (
        <li key={story.id}>
          <div className="id">
            <strong>#{id}</strong>
          </div>
          <div className="name">
            {name}
          </div>
          <div className="estimation">{estimate | 0}pts. / {estimatedHours}hrs.</div>
          <div className="dedicated-hours">0</div>
        </li>
      );
    });

    return (
      <ul className="stories-container">
        <li className="header" key="header">
          <div className="id">&#160;</div>
          <div className="name">&#160;</div>
          <div className="estimation">Estimated</div>
          <div className="dedicated-hours">Dedicated</div>
        </li>
        {items}
      </ul>
    );
  }

  _estimatedHours(points) {
    switch (points) {
      case 1:
        return 4;
      case 2:
        return 8;
      case 3:
        return 16;
      default:
        return 0;
    }
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
