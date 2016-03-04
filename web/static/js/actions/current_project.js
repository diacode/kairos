import Constants from '../constants';

export function fetchProject(socket, id) {
  return dispatch => {
    const channel = socket.channel(`project:${id}`);

    channel.join()
    .receive('ok', (response) => {
      dispatch({
        type: Constants.CURRENT_PROJECT_SET,
        project: response.project,
        channel: channel,
        stories: response.stories,
      });
    })
    .receive('error', (response) => {
      dispatch({
        type: Constants.CURRENT_PROJECT_ERROR,
        error: response.reason,
      });
    });
  };
}

export function reset() {
  return dispatch => {
    dispatch({ type: Constants.CURRENT_PROJECT_RESET });
  };
}