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

    const { firstName, lastName } = this.refs;
    const data = {
      user: {
        first_name: firstName.value.trim(),
        last_name: lastName.value.trim(),
      },
    };
    const { currentUser, dispatch } = this.props;

    dispatch(update(currentUser, data));
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div>
        <form onSubmit={::this._handleFormSubmit}>
          <label htmlFor="firstName">First name</label>
          <input type="text" ref="firstName" defaultValue={currentUser.firstName}/>
          <label htmlFor="lastName">Last name</label>
          <input type="text" ref="lastName" defaultValue={currentUser.lastName}/>
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
