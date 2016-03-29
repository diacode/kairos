import Constants  from '../constants';
import { push }   from 'react-router-redux';

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

    channel.on('deleted', (payload) => {
      channel.leave();
      dispatch(push('/projects'));
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

export function deleteProject(channel) {
  return dispatch => {
    channel.push('project:delete')
    .receive('error', (payload) => {
      console.log('Error deleting project');
    });;
  };
}

export function reset(channel) {
  return dispatch => {
    channel.leave();

    dispatch({ type: Constants.CURRENT_PROJECT_RESET });
  };
}
