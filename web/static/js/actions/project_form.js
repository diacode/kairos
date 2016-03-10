import { push }   from 'react-router-redux';
import Constants  from '../constants';

export function fetchExternalProjects(currentUser) {
  return dispatch => {
    currentUser.channel.push('user:external_projects')
    .receive('ok', (payload) => {
      dispatch({
        type: Constants.PROJECT_FORM_EXTERNAL_PROJECTS,
        pivotalTrackerProjects: payload.pivotal_tracker_projects,
        togglProjects: payload.toggl_projects,
      });
    });
  };
}

export function createProject(currentUser, data) {
  return dispatch => {
    currentUser.channel.push('user:create_project', { project: data })
    .receive('ok', (payload) => {
      dispatch(push(`/project/${payload.project.id}`));
    });
  };
}

export function reset() {
  return {
    type: Constants.PROJECT_FORM_RESET,
  };
}
