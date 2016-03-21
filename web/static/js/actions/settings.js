import Constants           from '../constants';
import User                from '../utils/user';
import SessionActions      from './sessions';

export function update(socket, currentUser, data) {
  return dispatch => {
    currentUser.channel.push('user:update', data)
    .receive('ok', (payload) => {
      dispatch(SessionActions.signOut(socket, currentUser.channel));
    });
  };
}
