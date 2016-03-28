import React from 'react';
import { connect }                      from 'react-redux';
import classnames                       from 'classnames';
import { Link }                         from 'react-router';
import { push }                         from 'react-router-redux';
import { setDocumentTitle }             from '../../utils';
import {
  setScheduledReports,
  fetchScheduledReports,
  deleteReport }                        from '../../actions/scheduled_reports';

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

  _deleteReport(scheduledReportId){
    const { currentUser, dispatch } = this.props;

    if(confirm('Are you sure?')){
      dispatch(deleteReport(currentUser.channel, scheduledReportId));
    }
  }

  _renderScheduledReports() {
    const { scheduledReports, fetching, currentUser, dispatch, channel } = this.props;

    if (fetching) return this._renderFetching();
    if (scheduledReports === null) return false;
    if (scheduledReports.length == 0) return this._renderNoResults();

    const scheduledReportsNodes = scheduledReports.map((item) => {
      const onClick = (e) => {
        e.preventDefault();
        this._deleteReport(item.id);
      }

      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.project.name}</td>
          <td>{item.days}</td>
          <td className="col-delete">
            <button onClick={onClick}>
              <i className="fa fa-trash"/>
            </button>
          </td>
        </tr>
      );
    });

    return (
      <table className="scheduled-reports-table">
        <thead>
          <tr>
            <th className="col-id">Id</th>
            <th className="col-name">Name</th>
            <th className="col-project">Project</th>
            <th className="col-days">Days</th>
            <th className="col-delete">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {scheduledReportsNodes}
        </tbody>
      </table>
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
      <div id="scheduled_reports_index" className="view-container">
        {::this._renderScheduledReports()}
        {this.props.children}
        <Link to="/scheduled_reports/new" className="btn">New Report</Link>
      </div>
    );
  }
};

const mapStateToProps = (state) => (
  { ...state.session, ...state.scheduledReports }
);

export default connect(mapStateToProps)(ScheduledReportsIndexView);
