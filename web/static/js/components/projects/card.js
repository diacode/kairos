import React, {PropTypes} from 'react';
import { routeActions }   from 'react-router-redux';

export default class ProjectCard extends React.Component {
  _handleClick(e) {
    e.preventDefault();

    const { dispatch, id } = this.props;

    dispatch(routeActions.push(`/project/${id}`));
  }

  render() {
    const { name, description } = this.props;

    return (
      <li className="project-item" onClick={::this._handleClick}>
        <div className="inner">
          <header>
            <h3>{name}</h3>
          </header>
          <p>{description}</p>
        </div>
      </li>
    );
  }
}
