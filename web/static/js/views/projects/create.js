import React, {PropTypes}         from 'react';
import { connect }                from 'react-redux';
import { push }                   from 'react-router-redux';
import { setDocumentTitle }       from '../../utils';
import { fetchExternalProjects }  from '../../actions/project_form';

class ProjectsCreateView extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.admin) dispatch(push('/'));

    setDocumentTitle('Create new project');
    dispatch(fetchExternalProjects(currentUser));
  }

  _renderOptions(projects) {
    return projects.map((project) => {
      return (
        <option key={project.id} value={project.id}>{project.name}</option>
      );
    });
  }

  render() {
    const { pivotalTrackerProjects, togglProjects } = this.props;

    if (pivotalTrackerProjects.length == 0 || togglProjects.length == 0) return null;

    return (
      <div className="view-container" id="projects_create">
        <header>
          <h1>Create new project</h1>
        </header>
        <form>
          <div className="inputs">
            <label>Name</label>
            <input ref="name" />
          </div>
          <div className="inputs">
            <label>Description</label>
            <textarea ref="description" />
          </div>
          <div className="inputs">
            <label>Pivotal Tracker Project</label>
            <select ref="pivotal_tracker_id">
              {::this._renderOptions(pivotalTrackerProjects)}
            </select>
          </div>
          <div className="inputs">
            <label>Toggl Project</label>
            <select ref="togglProjectsgl_id">
            {::this._renderOptions(togglProjects)}
            </select>
          </div>
          <div className="actions">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.projectForm }
);

export default connect(mapStateToProps)(ProjectsCreateView);
