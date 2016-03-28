import React, { PropTypes }       from 'react';
import { connect }                from 'react-redux';
import { push }                   from 'react-router-redux';
import { Link }                   from 'react-router';
import { setDocumentTitle }       from '../../utils';
import { fetchProjects }          from '../../actions/scheduled_report_form';
import { createScheduledReport }  from '../../actions/scheduled_report_form';
import { reset }                  from '../../actions/scheduled_report_form';
import Modal                      from '../../components/modal';

class ScheduledReportsNewView extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.admin) dispatch(push('/scheduled_reports'));

    setDocumentTitle('Create new Scheduled Report');
    dispatch(fetchProjects(currentUser));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(reset());
  }

  _renderOptions(projects) {
    return projects.map((project) => {
      return (
        <option key={project.id} value={project.id}>{project.name}</option>
      );
    });
  }

  _handleFormSubmit(e) {
    e.preventDefault();

    const { dispatch, currentUser, projects } = this.props;
    const { name, days, frequency, projectId, recipients, cc, cco } = this.refs;
    const projectIdValue = projectId.value;
    const project = projects.find((p) => { return p.id == projectIdValue; });

    const data = {
      name: name.value.trim(),
      days: days.value.trim(),
      frequency: frequency.value.trim(),
      project_id: projectIdValue,
      recipients: recipients.value.split(","),
      cc: cc.value.split(","),
      cco: cco.value.split(","),
    };

    dispatch(createScheduledReport(currentUser, data));
  }

  _handleModalClose() {
    const { dispatch } = this.props;
    dispatch(push('/scheduled_reports'));
  }

  _render() {
    const { projects } = this.props;

    if (projects.length == 0) return null;

    return (
      <div className="md-content">
        <header>
          <h1>Create new Scheduled Report</h1>
        </header>
        <form onSubmit={::this._handleFormSubmit}>
          <div className="inputs">
            <input ref="name" required={true} placeholder="Report name"/>
          </div>
          <div className="inputs">
            <input type="number" ref="days" placeholder="Number of days"  />
          </div>
          <div className="inputs">
            <input ref="frequency" required={true} placeholder="Frequency (use cron syntax)"/>
          </div>
          <div className="inputs">
            <label>Project</label>
            <select ref="projectId" required={true}>
            {::this._renderOptions(projects)}
            </select>
          </div>
          <div className="inputs">
            <label>To</label>
            <input ref="recipients" placeholder="Recipients (comma separated)"/>
          </div>
          <div className="inputs">
            <label>CCO</label>
            <input ref="cc" placeholder="CC (comma separated)"/>
          </div>
          <div className="inputs">
            <label>BCC</label>
            <input ref="cco" placeholder="CCO (comma separated)"/>
          </div>
          <div className="actions">
            <button type="submit">Save</button> or <Link to="/scheduled_reports">cancel</Link>
          </div>
        </form>
      </div>
    );
  }

  render() {
    return (
      <Modal onClose={::this._handleModalClose}>
        {::this._render()}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.scheduledReportForm }
);

export default connect(mapStateToProps)(ScheduledReportsNewView);
