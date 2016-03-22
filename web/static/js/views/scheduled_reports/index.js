import React from 'react';
import { connect }                      from 'react-redux';
import classnames                       from 'classnames';
import { push }                         from 'react-router-redux';
import { setDocumentTitle }             from '../../utils';
import { setScheduledReports,
  fetchScheduledReports }               from '../../actions/scheduled_reports';

class ScheduledReportsIndexView extends React.Component {
  componentDidMount() {
    setDocumentTitle('Scheduled Reports');
    this._fetchScheduledReports(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._fetchScheduledReports(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(setScheduledReports(null));
  }

  _fetchScheduledReports(props) {
    const { dispatch, scheduledReports, fetching, currentUser } = props;
    if (!currentUser.canFetchScheduledReports() || scheduledReports != null || fetching)
      return false;

    dispatch(fetchScheduledReports(currentUser.channel));
  }

  _renderScheduledReports() {
    const { scheduledReports, fetching, currentUser, dispatch, channel } = this.props;

    if (fetching) return this._renderFetching();
    if (scheduledReports === null) return false;
    if (scheduledReports.length == 0) return this._renderNoResults();

    const scheduledReportsNodes = scheduledReports.map((item) => {
      return (
        <div key={item.id}>
          {item.name}
        </div>
      );
    });

    return (
      <div className="scheduled-reports-list">
        {scheduledReportsNodes}
      </div>
    );
  }

  _renderNoResults() {
    return (
      <div className="view-container error-container">
        <i className="fa fa-meh-o"/>
        <p>Oops! No reports found</p>
      </div>
    );
  }

  _renderFetching() {
    return (
      <div className="view-container error-container">
        <i className="fa fa-cog fa-spin"/>
        <p>Fetching scheduled reports</p>
      </div>
    );
  }

  render() {
    return (
      <div className="view-container">
        {::this._renderScheduledReports()}
        {this.props.children}
      </div>
    );
  }
};

const mapStateToProps = (state) => (
  { ...state.session, ...state.scheduledReports }
);

export default connect(mapStateToProps)(ScheduledReportsIndexView);
