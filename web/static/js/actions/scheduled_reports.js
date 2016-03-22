import Constants from '../constants';

export function fetchScheduledReports(channel) {
  return dispatch => {
    dispatch({ type: Constants.SCHEDULED_REPORTS_FETCH_START });

    channel.push('user:scheduled_reports')
    .receive('ok', (payload) => {
      dispatch(setScheduledReports(payload.scheduled_reports));
    })
    .receive('error', (payload) => {
      dispatch(setScheduledReports([]));
    });
  };
}

export function setScheduledReports(scheduledReports) {
  return dispatch => {
    dispatch({
      type: Constants.SCHEDULED_REPORTS_SET,
      scheduledReports: scheduledReports,
    });
  };
}
