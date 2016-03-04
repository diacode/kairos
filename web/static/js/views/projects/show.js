import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';
import { fetchProject, reset }   from '../../actions/current_project';

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
      <div className="error">{error}</div>
    );
  }

  render() {
    const { currentUser, name, stories, id, error } = this.props;

    if (error != null) return this._renderError(error);
    if (id === undefined) return false;

    return (
      <div>
        <h1>{name}</h1>
        <p>{stories.length} stories</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.currentProject, socket: state.session.socket, currentUser: state.session.currentUser }
);

export default connect(mapStateToProps)(ProjectsShowView);
