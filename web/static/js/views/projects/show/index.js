import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';
import { IndexLink, Link }       from 'react-router';
import {
  fetchProject,
  deleteProject,
  reset }                        from '../../../actions/current_project';

export default class ProjectsShowView extends React.Component {
  componentDidMount() {
    this._fetchProject(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._fetchProject(nextProps);
  }

  componentWillUnmount() {
    const { dispatch, channel } = this.props;

    if (channel != null) {
      channel.leave();
      dispatch(reset(channel));
    }
  }

  _fetchProject(props) {
    const { params, dispatch, socket, currentUser, channel, error } = props;

    if (!currentUser.canFetchProjects() || channel != null || error != null) return false;

    dispatch(fetchProject(socket, params.id));
  }

  _renderError(error) {
    return (
      <div className="view-container error-container">
        <i className="fa fa-bomb"/>
        <p>{error}</p>
      </div>
    );
  }

  _renderStats() {
    const { total_story_points, total_completed_points, total_estimated_hours, total_dedicated_hours, velocity } = this.props;

    return (
      <ul className="stats-container">
        {::this._stat('Total points', `${total_completed_points}/${total_story_points}`)}
        {::this._stat('Total hours', `${total_dedicated_hours}/${total_estimated_hours}`)}
        {::this._stat('Velocity', `${velocity}%`, velocity > 100 ? 'ok' : 'error')}
      </ul>
    );
  }

  _stat(name, value, className) {
    return (
      <li>
        <div className={`inner ${className}`}>
          <div>
            <strong>{value}</strong>
            <small>{name}</small>
          </div>
        </div>
      </li>
    );
  }

  _renderActions() {
    const { currentUser } = this.props;

    if (!currentUser.admin) return false;

    return (
      <li>
        <a href="#" onClick={::this._handleCancelClick}><i className="fa fa-trash"/> delete project</a>
      </li>
    );
  }

  _handleCancelClick(e) {
    e.preventDefault();

    const { dispatch, channel } = this.props;

    if (confirm('Are you sure?')) dispatch(deleteProject(channel));
  }

  render() {
    const { currentUser, name, description, stories, id, error } = this.props;

    if (error != null) return this._renderError(error);
    if (id === undefined) return null;

    return (
      <div id="projects_show">
        <header id="project_header">
          <div className="container">
            <h1>{name}</h1>
            <p>{description}</p>
            {::this._renderStats()}
          </div>
        </header>
        <nav id="project_nav">
          <div className="container">
            <ul>
              <li>
                <IndexLink to={`/project/${id}`} activeClassName="active">Stories</IndexLink>
              </li>
              {::this._renderActions()}
            </ul>
          </div>
        </nav>
        <section>
          {this.props.children}
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.currentProject, socket: state.session.socket, currentUser: state.session.currentUser }
);

export default connect(mapStateToProps)(ProjectsShowView);
