import React, {PropTypes}   from 'react';
import { connect }          from 'react-redux';
import { setDocumentTitle } from '../../utils';
import { update }           from '../../actions/settings';

class SettingsIndexView extends React.Component {
  componentDidMount() {
    setDocumentTitle('Settings');
  }

  _handleFormSubmit(e) {
    e.preventDefault();

    const { pivotalTrackerApiToken, togglApiToken } = this.refs;
    const data = {
      settings: {
        pivotal_tracker_api_token: pivotalTrackerApiToken.value.trim(),
        toggle_api_token: togglApiToken.value.trim(),
      },
    };
    const { currentUser, dispatch } = this.props;

    dispatch(update(currentUser, data));
  }

  render() {
    const { currentUser } = this.props;

    if (!currentUser) return false;

    const { settings } = currentUser;

    const pivotalTrackerApiToken = settings ? settings.pivotal_tracker_api_token : '';
    const togglApiToken = settings ? settings.toggle_api_token : '';

    return (
      <div>
        <form onSubmit={::this._handleFormSubmit}>
          <label htmlFor="pivotalTrackerApiToken">Pivotal Tracker API token</label>
          <input type="text" ref="pivotalTrackerApiToken" defaultValue={pivotalTrackerApiToken}/>
          <label htmlFor="togglApiToken">Toggle API token</label>
          <input type="text" ref="togglApiToken" defaultValue={togglApiToken}/>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(SettingsIndexView);
