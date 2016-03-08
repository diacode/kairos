import React                            from 'react';
import { connect }                      from 'react-redux';
import classnames                       from 'classnames';
import { setDocumentTitle }             from '../../utils';
import { setProjects, fetchProjects }   from '../../actions/projects';
import ProjectCard                      from '../../components/projects/card';

class HomeIndexView extends React.Component {
  componentDidMount() {
    this._fetchProjects(this.props);
  }

  componentWillReceiveProps(nextProps) {
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

    if (fetching) return this._renderFetching();
    if (projects === null) return false;

    const projectsNodes = projects.map((item) => {
      return (
        <ProjectCard
          key={item.id}
          dispatch={dispatch}
          {...item} />
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
