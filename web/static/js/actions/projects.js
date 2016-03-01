import Constants from '../constants';

export function fetchProjects(channel) {
  return dispatch => {
    dispatch({ type: Constants.PROJECTS_FETCH_START });

    channel.push('user:projects')
    .receive('ok', (payload) => {
      dispatch(setProjects(payload.projects));
    })
    .receive('error', (payload) => {
      dispatch(setProjects([]));
    });
  };
}

export function setProjects(projects) {
  return dispatch => {
    dispatch({
      type: Constants.PROJECTS_SET,
      projects: projects,
    });
  };
}
