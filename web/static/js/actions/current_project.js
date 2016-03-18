import Constants from '../constants';

function setCurrentProject(channel, project) {
  return {
    type: Constants.CURRENT_PROJECT_SET,
    channel: channel,
    project: { ...project },
  };
}

export function fetchProject(socket, id) {
  return dispatch => {
    const channel = socket.channel(`project:${id}`);

    channel.join()
    .receive('ok', (response) => {
      dispatch(setCurrentProject(channel, response));
    })
    .receive('error', (response) => {
      dispatch({
        type: Constants.CURRENT_PROJECT_ERROR,
        error: response.reason,
      });
    });

    channel.on('update', (payload) => {
      dispatch(setCurrentProject(channel, payload.project));
    });
  };
}

export function filterStories(data) {
  return dispatch => {
    dispatch({
      type: Constants.CURRENT_PROJECT_FILTER_STORIES,
      data: data,
    });
  };
}

export function reset() {
  return dispatch => {
    dispatch({ type: Constants.CURRENT_PROJECT_RESET });
  };
}
