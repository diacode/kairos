import React                from 'react';
import { connect }          from 'react-redux';
import classnames           from 'classnames';

import { setDocumentTitle } from '../../utils';
import { setProjects }      from '../../actions/projects';

class HomeIndexView extends React.Component {
  componentDidMount() {
    setDocumentTitle('Home');
    this._fetchProjects(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._fetchProjects(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(setProjects(null));
  }

  _fetchProjects(nextProps) {
    const { channel, dispatch, projects } = nextProps;

    if (channel === null || projects != null) return false;

    channel.push('user:projects')
    .receive('ok', (payload) => {
      dispatch(setProjects(payload.projects));
    });
  }

  _renderProjects() {
    const { projects } = this.props;

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

  render() {
    return (
      <div className='view-container home index'>
        {::this._renderProjects()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, projects: state.projects.items }
);

export default connect(mapStateToProps)(HomeIndexView);
