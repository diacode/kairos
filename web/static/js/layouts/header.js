import React            from 'react';
import { connect }      from 'react-redux';
import { Link }         from 'react-router';
import ReactGravatar    from 'react-gravatar';
import { routeActions } from 'react-router-redux';

import SessionActions   from '../actions/sessions';
import HeaderActions    from '../actions/header';

class Header extends React.Component {
  _renderCurrentUser() {
    const { currentUser } = this.props;

    return (
      <a className="current-user">
        <ReactGravatar className="react-gravatar" email={currentUser.email} https />
      </a>
    );
  }

  _renderSignOutLink() {
    if (!this.props.currentUser) {
      return false;
    }

    return (
      <a href="#" onClick={::this._handleSignOutClick}><i className="fa fa-sign-out"/> Sign out</a>
    );
  }

  _handleSignOutClick(e) {
    e.preventDefault();

    const { dispatch, socket, currentUser } = this.props;

    dispatch(SessionActions.signOut(socket, currentUser.channel));
  }

  render() {
    return (
      <header className="main-header">
        <Link to="/projects">
          <div className="logo-small"></div>
        </Link>
        <nav className="right">
          <ul>
            <li>
              {this._renderCurrentUser()}
            </li>
            <li>
              {this._renderSignOutLink()}
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(Header);
