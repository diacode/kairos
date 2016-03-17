import React, {PropTypes} from 'react';
import { push }           from 'react-router-redux';
import classnames         from 'classnames';

export default class ProjectCard extends React.Component {
  _handleClick(e) {
    e.preventDefault();

    const { dispatch, id } = this.props;

    dispatch(push(`/project/${id}`));
  }

  render() {
    const { name, description, total_estimated_hours, total_dedicated_hours, velocity } = this.props;

    const velocityClasses = classnames({
      velocity: true,
      ok: velocity >= 100,
      error: velocity < 100,
    });

    return (
      <li className="project-item" onClick={::this._handleClick}>
        <div className="inner">
          <header>
            <h3>{name}</h3>
          </header>
          <p>{description}</p>

          <div className="metrics">
            <div>
              <strong>{total_dedicated_hours}/{total_estimated_hours}</strong>
              <small>Hours</small>
            </div>
            <div className={velocityClasses}>
              <strong>{velocity}%</strong>
              <small>Velocity</small>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
