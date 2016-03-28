import Constants from '../constants';

const initialState = {
  fetching: false,
  scheduledReports: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SCHEDULED_REPORTS_FETCH_START:
      return { ...state, fetching: true };

    case Constants.SCHEDULED_REPORTS_SET:
      return { ...initialState, scheduledReports: action.scheduledReports, fetching: false };

    case Constants.SCHEDULED_REPORTS_ADD:
      let scheduledReports = state.scheduledReports;
      scheduledReports.push(action.scheduledReport);
      return { ...initialState, scheduledReports: scheduledReports }

    default:
      return state;
  }
}
