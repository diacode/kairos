import React                from 'react';
import { connect }          from 'react-redux';
import classnames           from 'classnames';

import { setDocumentTitle } from '../../utils';
import { setProjects, fetchProjects }      from '../../actions/projects';

class HomeIndexView extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetching } = nextProps;

    this._fetchProjects(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(setProjects(null));
  }

  _fetchProjects(props) {
    const { channel, dispatch, projects, fetching } = props;

    if (channel === null || projects != null || fetching) return false;

    dispatch(fetchProjects(channel));
  }

  _renderProjects() {
    const { projects, fetching } = this.props;

    if (fetching) return this._renderFetching();
    if (projects === null) return false;

    const projectsNodes = projects.map((item) => {
      return (
        <li key={item.id}>
          <h2>{item.name}</h2>
        </li>
      );
    });

    return (
      <ul>
        {projectsNodes}
      </ul>
    );
  }

  _renderFetching() {
    return (
      <div>
        Fetching
      </div>
    );
  }

  render() {
    return (
      <div className='view-container home index'>
        {::this._renderProjects()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.projects }
);

export default connect(mapStateToProps)(HomeIndexView);
