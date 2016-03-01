import Constants from '../constants';

const initialState = {
  fetching: false,
  projects: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.PROJECTS_FETCH_START:
      return { ...state, fetching: true };

    case Constants.PROJECTS_SET:
      return { ...initialState, projects: action.projects, fetching: false };

    default:
      return state;
  }
}
