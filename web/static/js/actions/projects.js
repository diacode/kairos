import Constants from '../constants';

export function setProjects(projects) {
  return dispatch => {
    dispatch({
      type: Constants.PROJECTS_SET,
      projects: projects,
    });
  };
}
