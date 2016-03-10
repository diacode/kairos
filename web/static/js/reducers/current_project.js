import Constants from '../constants';

const initialState = {
  stories: null,
  channel: null,
  error: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.CURRENT_PROJECT_SET:
      return { ...state, ...action.project, channel: action.channel, error: null };

    case Constants.CURRENT_PROJECT_ERROR:
      return { ...state, error: action.error };

    case Constants.CURRENT_PROJECT_RESET:
      return { ...initialState };

    default:
      return state;
  }
}
