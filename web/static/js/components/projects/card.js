import React, {PropTypes} from 'react';
import { push }            from 'react-router-redux';

export default class ProjectCard extends React.Component {
  _handleClick(e) {
    e.preventDefault();

    const { dispatch, id } = this.props;

    dispatch(push(`/project/${id}`));
  }

  render() {
    const { name, description, total_estimated_hours, total_dedicated_hours } = this.props;

    return (
      <li className="project-item" onClick={::this._handleClick}>
        <div className="inner">
          <header>
            <h3>{name}</h3>
          </header>
          <p>{description}</p>

          <div className="metrics">
            <div>
              <strong>{total_estimated_hours}</strong>
              <small>Estimated hours</small>
            </div>
            <div>
              <strong>{total_dedicated_hours}</strong>
              <small>Dedicated hours</small>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
