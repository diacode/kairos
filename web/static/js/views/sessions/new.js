import React, {PropTypes}   from 'react';
import { connect }          from 'react-redux';

import { setDocumentTitle } from '../../utils';
import Actions              from '../../actions/sessions';

class SessionsNew extends React.Component {
  componentDidMount() {
    setDocumentTitle('Sign in');
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.refs;
    const { dispatch } = this.props;

    dispatch(Actions.signIn(email.value, password.value));
  }

  _renderError() {
    let { error } = this.props;

    if (!error) return false;

    return (
      <ul className="errors-container">
        <li>{error}</li>
      </ul>
    );
  }

  render() {
    return (
      <div id="sessions_new" className="view-container">
        <main>
          <header>
            <div className="logo-small" />
          </header>
          <form id="sign_in_form" onSubmit={::this._handleSubmit}>
            {::this._renderError()}
            <div className="field-wrapper">
              <input
                ref="email"
                type="Email"
                id="user_email"
                placeholder="Email"
                required="true" />
              <input
                ref="password"
                type="password"
                id="user_password"
                placeholder="Password"
                required="true" />
            </div>
            <button type="submit">Sign in</button>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(SessionsNew);
