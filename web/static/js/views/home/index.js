import React                            from 'react';
import { connect }                      from 'react-redux';
import classnames                       from 'classnames';
import { setDocumentTitle }             from '../../utils';
import { setProjects, fetchProjects }   from '../../actions/projects';
import OnboardingForm                   from '../../components/onboarding';

class HomeIndexView extends React.Component {
  componentWillReceiveProps(nextProps) {
    this._fetchProjects(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(setProjects(null));
  }

  _fetchProjects(props) {
    const { channel, dispatch, projects, fetching, currentUser } = props;

    if (currentUser === null || currentUser.settings === null || currentUser.settings.pivotal_tracker_api_token === null || currentUser.settings.pivotal_tracker_api_token === '') return false;
    if (channel === null || projects != null || fetching) return false;

    dispatch(fetchProjects(channel));
  }

  _renderProjects() {
    const { projects, fetching, currentUser, dispatch, channel } = this.props;

    if (currentUser.settings === null || currentUser.settings.pivotal_tracker_api_token === null || currentUser.settings.pivotal_tracker_api_token === '') {
      return (
        <OnboardingForm
          currentUser={currentUser}
          dispatch={dispatch}
          channel={channel} />
      );
    }

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
    const { currentUser } = this.props;

    if (!currentUser) return false;

    return (
      <div className="view-container home index">
        {::this._renderProjects()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.projects }
);

export default connect(mapStateToProps)(HomeIndexView);
