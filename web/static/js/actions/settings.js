import Constants from '../constants';
import User      from '../utils/user';

export function update(currentUser, data) {
  return dispatch => {
    currentUser.channel.push('user:update', data)
    .receive('ok', (payload) => {
      const newUser = new User(payload.user);
      newUser.channel = currentUser.channel;

      dispatch({
        type: Constants.CURRENT_USER,
        currentUser: newUser,
      });
    });
  };
}
