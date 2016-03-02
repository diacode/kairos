import React, {PropTypes} from 'react';

export default class ProjectCard extends React.Component {
  render() {
    const { name } = this.props;

    return (
      <li className="project-item">
        <div className="inner">
          <h2>{name}</h2>
        </div>
      </li>
    );
  }
}
