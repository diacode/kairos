import Constants from '../constants';

const initialState = {
  stories: null,
  channel: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.CURRENT_PROJECT_SET:
      return { ...state, ...action.project, channel: action.channel, stories: action.stories };

    case Constants.CURRENT_PROJECT_RESET:
      return { ...initialState };

    default:
      return state;
  }
}
