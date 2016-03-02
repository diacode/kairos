import Constants from '../constants';

const initialState = {
  currentUser: null,
  socket: null,
  error: null,
};

export default function reducer(state = initialState, action = {}) {
  let user = null;

  switch (action.type) {
    case Constants.CURRENT_USER:
      return { ...state, currentUser: action.currentUser, socket: action.socket, error: null };

    case Constants.USER_SIGNED_OUT:
      return initialState;

    case Constants.SESSIONS_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
}
