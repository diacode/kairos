import React, {PropTypes} from 'react';

export default class Modal extends React.Component {
  _handleOverlayClick(e) {
    if (e.target.id != 'modal_overlay') return false;

    this.props.onClose();
  }

  render() {
    return (
      <div id="modal_overlay" className="md-overlay" onClick={::this._handleOverlayClick}>
        <div className="md-modal">
          {this.props.children}
        </div>
      </div>
    );
  }
}
