import Constants from '../constants';

const initialState = {
  fetching: false,
  projects: null,
};

export default function reducer(state = initialState, action = {}) {
  let projects = null;

  switch (action.type) {
    case Constants.PROJECTS_FETCH_START:
      return { ...state, fetching: true };

    case Constants.PROJECTS_SET:
      return { ...initialState, projects: action.projects, fetching: false };

    case Constants.PROJECTS_ADD:
      if (state.projects == null) return { ...state };

      projects = [...state.projects];
      projects.push(action.project);

      return { ...initialState, projects: projects };

    case Constants.PROJECTS_REMOVE:
      if (state.projects == null) return { ...state };

      projects = [...state.projects];
      const index = projects.findIndex((project) => project.id == action.projectId);
      projects.splice(index, 1);

      return { ...initialState, projects: projects };

    default:
      return state;
  }
}
