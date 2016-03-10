import React, {PropTypes}   from 'react';
import { connect }          from 'react-redux';
import { Link }             from 'react-router';

import { setDocumentTitle, renderErrorsFor } from '../../utils';
import Actions              from '../../actions/registrations';

class RegistrationsNew extends React.Component {
  componentDidMount() {
    setDocumentTitle('Sign up');
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { dispatch } = this.props;

    const data = {
      first_name: this.refs.firstName.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
    };

    dispatch(Actions.signUp(data));
  }

  _renderErrors(errors) {
    if (!errors) return false;

    return (
      <ul className="errors-container">
        <li>{renderErrorsFor(errors, 'first_name')}</li>
        <li>{renderErrorsFor(errors, 'email')}</li>
        <li>{renderErrorsFor(errors, 'password')}</li>
      </ul>
    );
  }

  render() {
    const { errors } = this.props;

    return (
      <div id="registrations_new" className="view-container">
        <main>
          <header>
            <div className="logo-small" />
          </header>
          <form id="sign_up_form" onSubmit={::this._handleSubmit}>
            {::this._renderErrors(errors)}
            <div className="field-wrapper">
              <input ref="firstName" id="user_first_name" type="text" placeholder="First name" required={true} />
              <input ref="email" id="user_email" type="email" placeholder="Email" required={true} />
              <input ref="password" id="user_password" type="password" placeholder="Password" required={true} />
            </div>
            <button type="submit">Sign up</button>
          </form>
          <Link to="/sign_in">Sign in</Link>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.registration.errors,
});

export default connect(mapStateToProps)(RegistrationsNew);
