import React, {PropTypes} from 'react';

export default class NotFoundView extends React.Component {
  render() {
    return (
      <div className="view-container error-container">
        <i className="fa fa-meh-o"/>
        <p>Oops! Page not found</p>
      </div>
    );
  }
}
