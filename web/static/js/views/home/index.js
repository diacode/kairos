import React                            from 'react';
import { connect }                      from 'react-redux';
import classnames                       from 'classnames';
import { setDocumentTitle }             from '../../utils';
import { setProjects, fetchProjects }   from '../../actions/projects';
import OnboardingForm                   from '../../components/onboarding';
import ProjectCard                      from '../../components/projects/card';

class HomeIndexView extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { currentUser } = nextProps;

    if (!currentUser) return false;

    this._fetchProjects(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(setProjects(null));
  }

  _fetchProjects(props) {
    const { dispatch, projects, fetching, currentUser } = props;

    if (!currentUser.canFetchProjects() || projects != null || fetching) return false;

    dispatch(fetchProjects(currentUser.channel));
  }

  _renderProjects() {
    const { projects, fetching, currentUser, dispatch, channel } = this.props;

    if (!currentUser.hasValidSettings()) {
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
        <ProjectCard key={item.id} {...item} />
      );
    });

    return (
      <ul className="project-list">
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
