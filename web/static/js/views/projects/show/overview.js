import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';

export default class ProjectsShowOverview extends React.Component {
  _renderStats() {
    const { total_story_points, total_completed_points, total_estimated_hours, total_worked_hours } = this.props;

    return (
      <ul className="stats-container">
      {::this._stat('Total story points', total_story_points)}
      {::this._stat('Total completed points', total_completed_points)}
      {::this._stat('Total estimated hours', total_estimated_hours)}
        {::this._stat('Total worked hours', total_worked_hours)}
      </ul>
    );
  }

  _stat(name, value) {
    return (
      <li>
        <div className="inner">
          <div>
            <strong>{value}</strong>
            <small>{name}</small>
          </div>
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className="container">
        {::this._renderStats()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.currentProject }
);

export default connect(mapStateToProps)(ProjectsShowOverview);
