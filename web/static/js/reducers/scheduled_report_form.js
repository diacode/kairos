import Constants from '../constants';

const initialState = {
  projects: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SCHEDULED_REPORT_FORM_PROJECTS:
      return {
        ...state,
        projects: action.projects,
      };

    case Constants.SCHEDULED_REPORT_FORM_RESET:
      const { projects } = state;
      return { ...initialState, projects: projects };

    default:
      return state;
  }
}
