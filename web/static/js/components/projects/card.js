import React, {PropTypes} from 'react';
import { routeActions }   from 'react-router-redux';

export default class ProjectCard extends React.Component {
  _handleClick(e) {
    e.preventDefault();

    const { dispatch, id } = this.props;

    dispatch(routeActions.push(`/projects/${id}`));
  }

  render() {
    const { name } = this.props;

    return (
      <li className="project-item" onClick={::this._handleClick}>
        <div className="inner">
          <h2>{name}</h2>
        </div>
      </li>
    );
  }
}
