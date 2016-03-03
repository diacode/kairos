import React, { PropTypes } from 'react';
import { update }   from '../../actions/settings';

export default class OnboardingForm extends React.Component {

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

  render () {
    const { currentUser } = this.props;
    const { settings } = currentUser;

    let pivotalTrackerApiToken = settings != null ? settings.pivotal_tracker_api_token : '';
    let togglApiToken = settings != null ? settings.toggle_api_token : '';

    return (
      <div className="modal">
        <form onSubmit={::this._handleFormSubmit}>
          <input type="text" ref="pivotalTrackerApiToken" defaultValue={pivotalTrackerApiToken}/>
          <input type="text" ref="togglApiToken" defaultValue={togglApiToken}/>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }
}
