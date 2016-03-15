import React            from 'react';
import { connect }      from 'react-redux';
import { push }          from 'react-router-redux';
import Header           from '../layouts/header';

class AuthenticatedContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { dispatch, children } = nextProps;

    if (children == null) dispatch(push     ('/projects'));
  }

  render() {
    const { currentUser } = this.props;

    if (!currentUser) return false;

    return (
      <div id="authenticated_container" className="application-container">
        <Header/>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(AuthenticatedContainer);
