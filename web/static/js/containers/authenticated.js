import React       from 'react';
import { connect } from 'react-redux';
import Header      from '../layouts/header';

class AuthenticatedContainer extends React.Component {
  render() {
    const { currentUser } = this.props;

    if (!currentUser) return false;

    return (
      <div id="authenticated_container" className="application-container">
        <Header/>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(AuthenticatedContainer);
