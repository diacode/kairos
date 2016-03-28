import React            from 'react';
import { connect }      from 'react-redux';
import { Link }         from 'react-router';
import ReactGravatar    from 'react-gravatar';
import { push }         from 'react-router-redux';
import PageClick        from 'react-page-click';
import classnames       from 'classnames';
import SessionActions   from '../actions/sessions';
import { showDropdown } from '../actions/header';

class Header extends React.Component {
  _renderCurrentUser() {
    const { currentUser, showMenu } = this.props;

    if (!currentUser) {
      return false;
    }

    const classes = classnames({
      'current-user': true,
      visible: showMenu,
    });

    return (
      <a href="#" onClick={::this._handleShowDropdownClick} className={classes}>
        <ReactGravatar className="react-gravatar" email={currentUser.email} https />
      </a>
    );
  }

  _handleShowDropdownClick(e) {
    e.preventDefault();
    const { dispatch, showMenu } = this.props;

    if (showMenu) return false;

    dispatch(showDropdown(!showMenu));
  }

  _handleSignOutClick(e) {
    e.preventDefault();

    const { dispatch, socket, currentUser } = this.props;

    dispatch(SessionActions.signOut(socket, currentUser.channel));
  }

  _renderDropdown(show) {
    if (!show) return false;

    return (
      <PageClick onClick={::this._handlePageClick}>
        <ul className="dropdown">
          <li>
            <Link to="/settings" onClick={::this._handlePageClick}>Settings</Link>
          </li>
          <li>
            <a href="#" onClick={::this._handleSignOutClick}>Sign out</a>
          </li>
        </ul>
      </PageClick>
    );
  }

  _handlePageClick() {
    const { dispatch } = this.props;

    dispatch(showDropdown(false));
  }

  render() {
    const { showMenu } = this.props;

    return (
      <header className="main-header">
        <Link to="/projects">
          <div className="logo-small"></div>
        </Link>
        <nav className="right">
          <ul>
            <li>
              <Link to="/projects" activeClassName="active">Projects</Link>
            </li>
            <li>
              <Link to="/reports" activeClassName="active">Reports</Link>
            </li>
            <li className="menu-wrapper">
              {this._renderCurrentUser()}
              {this._renderDropdown(showMenu)}
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.header }
);

export default connect(mapStateToProps)(Header);
