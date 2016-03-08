import Constants from '../constants';

const initialState = {
  pivotalTrackerProjects: [],
  togglProjects: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.PROJECT_FORM_EXTERNAL_PROJECTS:
      return {
        ...state,
        pivotalTrackerProjects: action.pivotalTrackerProjects,
        togglProjects: action.togglProjects,
      };
    default:
      return state;
  }
}
