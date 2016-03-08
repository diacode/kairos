import Constants from '../constants';

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
