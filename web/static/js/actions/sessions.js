import { push }                           from 'react-router-redux';
import Constants                          from '../constants';
import { Socket }                         from 'phoenix';
import { httpGet, httpPost, httpDelete }  from '../utils';
import User                               from '../utils/user';
import { setProjects }                    from './projects';

export function setCurrentUser(dispatch, user) {
  const socket = new Socket('/socket', {
    params: { token: localStorage.getItem('phoenixAuthToken') },
    logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data); },
  });

  socket.connect();

  const channel = socket.channel(`users:${user.id}`);

  if (channel.state != 'joined') {
    channel.join()
    .receive('ok', () => {
      user.channel = channel;

      dispatch({
          type: Constants.CURRENT_USER,
          currentUser: new User(user),
          socket: socket,
        });
    });

    channel.on('update_projects', (payload) => {
      dispatch(setProjects(payload.projects));
    });

    channel.on('project_added', (payload) => {
      dispatch({
        type: Constants.PROJECTS_ADD,
        project: payload.project,
      });
    });

    channel.on('project_removed', (payload) => {
      dispatch({
        type: Constants.PROJECTS_REMOVE,
        projectId: payload.project_id,
      });
    });
  }
};

const Actions = {
  signIn: (email, password) => {
    return dispatch => {
      const data = {
        session: {
          email: email,
          password: password,
        },
      };

      httpPost('/api/v1/sessions', data)
      .then((data) => {
        localStorage.setItem('phoenixAuthToken', data.jwt);
        setCurrentUser(dispatch, data.user);
        dispatch(push('/projects'));
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.SESSIONS_ERROR,
            error: errorJSON.error,
          });
        });
      });
    };
  },

  currentUser: () => {
    return dispatch => {
      const authToken = localStorage.getItem('phoenixAuthToken');

      httpGet('/api/v1/current_user')
      .then(function (data) {
        setCurrentUser(dispatch, data);
      })
      .catch(function (error) {
        console.log(error);
        dispatch(push('/sign_in'));
      });
    };
  },

  signOut: (socket, channel) => {
    return dispatch => {
      httpDelete('/api/v1/sessions')
      .then((data) => {
        localStorage.removeItem('phoenixAuthToken');

        channel.leave();
        socket.disconnect();

        dispatch({ type: Constants.USER_SIGNED_OUT });

        dispatch(push('/sign_in'));
      })
      .catch(function (error) {
        console.log(error);
      });
    };
  },
};

export default Actions;
