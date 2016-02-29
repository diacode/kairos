import Constants from '../constants';

const initialState = {
  items: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.PROJECTS_SET:
      return { ...initialState, items: action.projects };

    default:
      return state;
  }
}
