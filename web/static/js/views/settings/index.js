import React, {PropTypes} from 'react';
import { connect }        from 'react-redux';
import { setCurrentUser } from '../../actions/settings';

class SettingsIndexView extends React.Component {
  _handleFormSubmit(e) {
    e.preventDefault();

    const { pivotalTrakerApiToken, togglApiToken } = this.refs;
    const data = {
      settings: {
        pivotal_traker_api_token: pivotalTrakerApiToken.value.trim(),
        toggle_api_token: togglApiToken.value.trim(),
      },
    };
    const { channel } = this.props;

    channel.push('user:update', data)
    .receive('ok', (payload) => {
      setCurrentUser(payload.user);
    });
  }

  render() {
    const { currentUser } = this.props;
    const { settings } = currentUser;

    let pivotalTrakerApiToken = settings ? settings.pivotal_traker_api_token : '';
    let togglApiToken = settings ? settings.toggle_api_token : '';

    return (
      <div>
        <form onSubmit={::this._handleFormSubmit}>
          <input type="text" ref="pivotalTrakerApiToken" defaultValue={pivotalTrakerApiToken}/>
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
