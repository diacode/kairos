import React                            from 'react';
import { connect }                      from 'react-redux';
import classnames                       from 'classnames';
import { Link }                         from 'react-router';
import { push }                         from 'react-router-redux';
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

    projectsNodes.push(this._renderAddNewProject());

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

  _renderAddNewProject() {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.admin) return false;

    const onClick = (e) => {
      dispatch(push('/projects/new'));
    };

    return (
      <li key="new" className="project-item add-new">
        <div className="inner" onClick={onClick}>
          <div>
            <i className="fa fa-plus-circle" />
            Create new project
          </div>
        </div>
      </li>
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
