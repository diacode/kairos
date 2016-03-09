import React, {PropTypes}         from 'react';
import { connect }                from 'react-redux';
import { push }                   from 'react-router-redux';
import { setDocumentTitle }       from '../../utils';
import { fetchExternalProjects }  from '../../actions/project_form';
import { createProject }          from '../../actions/project_form';
import { reset }                  from '../../actions/project_form';

class ProjectsCreateView extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.admin) dispatch(push('/'));

    setDocumentTitle('Create new project');
    dispatch(fetchExternalProjects(currentUser));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(reset());
  }

  _renderOptions(projects) {
    return projects.map((project) => {
      return (
        <option key={project.id} value={project.id}>{project.name}</option>
      );
    });
  }

  _handleFormSubmit(e) {
    e.preventDefault();

    const { dispatch, currentUser } = this.props;
    const { name, description, pivotalTrackerId, togglId } = this.refs;

    const data = {
      name: name.value.trim(),
      description: description.value.trim(),
      pivotal_tracker_id: pivotalTrackerId.value.trim(),
      toggl_id: togglId.value.trim(),
    };

    dispatch(createProject(currentUser, data));
  }

  render() {
    const { pivotalTrackerProjects, togglProjects } = this.props;

    if (pivotalTrackerProjects.length == 0 || togglProjects.length == 0) return null;

    return (
      <div className="view-container" id="projects_create">
        <header>
          <h1>Create new project</h1>
        </header>
        <form onSubmit={::this._handleFormSubmit}>
          <div className="inputs">
            <label>Name</label>
            <input ref="name" required={true}/>
          </div>
          <div className="inputs">
            <label>Description</label>
            <textarea ref="description" />
          </div>
          <div className="inputs">
            <label>Pivotal Tracker Project</label>
            <select ref="pivotalTrackerId" required={true}>
              {::this._renderOptions(pivotalTrackerProjects)}
            </select>
          </div>
          <div className="inputs">
            <label>Toggl Project</label>
            <select ref="togglId" required={true}>
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
