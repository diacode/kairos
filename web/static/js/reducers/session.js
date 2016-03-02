import Constants from '../constants';
import User      from '../utils/user';

const initialState = {
  currentUser: null,
  socket: null,
  error: null,
};

export default function reducer(state = initialState, action = {}) {
  let user = null;

  switch (action.type) {
    case Constants.CURRENT_USER:
      user = new User(action.currentUser);
      return { ...state, currentUser: user, error: null };

    case Constants.USER_SIGNED_OUT:
      return initialState;

    case Constants.SOCKET_CONNECTED:
      user = state.currentUser.clone();
      user.setChannel(action.channel);

      return { ...state, socket: action.socket, currentUser: user };

    case Constants.SESSIONS_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
}
