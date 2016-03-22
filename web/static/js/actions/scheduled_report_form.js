import { push }   from 'react-router-redux';
import Constants  from '../constants';

export function fetchProjects(currentUser) {
  return dispatch => {
    currentUser.channel.push('user:projects')
    .receive('ok', (payload) => {
      dispatch({
        type: Constants.SCHEDULED_REPORT_FORM_PROJECTS,
        projects: payload.projects,
      });
    });
  };
}

export function createScheduledReport(currentUser, data) {
  return dispatch => {
    currentUser.channel.push('user:create_scheduled_report', { scheduled_report: data })
    .receive('ok', (payload) => {
      //dispatch(push(`/project/${payload.project.id}`));
      dispatch(push(`/scheduled_reports`));
    });
  };
}

export function reset() {
  return {
    type: Constants.PROJECT_FORM_RESET,
  };
}
