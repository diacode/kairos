import Constants from '../constants';

export function setCurrentUser(dispatch, user) {
  return dispatch => {
    dispatch({
      type: Constants.CURRENT_USER,
      currentUser: user,
    });
  };
}
