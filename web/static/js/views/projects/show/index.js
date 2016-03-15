import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';
import { IndexLink, Link }       from 'react-router';
import { fetchProject, reset }   from '../../../actions/current_project';

export default class ProjectsShowView extends React.Component {
  componentDidMount() {
    this._fetchProject(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._fetchProject(nextProps);
  }

  componentWillUnmount() {
    const { dispatch, channel } = this.props;

    if (channel != null)channel.leave();

    dispatch(reset());
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
          </div>
        </header>
        <nav id="project_nav">
          <div className="container">
            <ul>
              <li>
                <IndexLink to={`/project/${id}`} activeClassName="active">Overview</IndexLink>
              </li>
              <li>
                <Link to={`/project/${id}/stories`} activeClassName="active">Stories</Link>
              </li>
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
