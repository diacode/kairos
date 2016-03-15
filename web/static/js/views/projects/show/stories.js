import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';
import { setDocumentTitle }      from '../../../utils';
import classnames                from 'classnames';

export default class ProjectsShowStories extends React.Component {
  componentDidMount() {
    const { name } = this.props;

    setDocumentTitle(`${name} stories`);
  }

  _renderStories() {
    const { projectStories } = this.props;

    const items = projectStories.map((story) => {
      const { id, name, estimate, status, dedicatedHours, estimatedHours } = story;

      const statusClasses = classnames({
        id: true,
        ok: dedicatedHours <= estimatedHours && dedicatedHours > 0,
        error: dedicatedHours > estimatedHours,
      });

      return (
        <li key={story.id}>
          <div className={statusClasses}>
            <strong>#{id}</strong>
          </div>
          <div className="name">
            {name}
          </div>
          <div className="status">
            <small>{status}</small>
          </div>
          <div className="estimation">{estimate | 0}<small>pts.</small> / {estimatedHours}<small>hrs.</small></div>
          <div className="dedicated-hours">{dedicatedHours}<small>hrs.</small></div>
        </li>
      );
    });

    return (
      <ul className="stories-container">
        <li className="header" key="header">
          <div className="id"> </div>
          <div className="name"> </div>
          <div className="status"> </div>
          <div className="estimation">Estimated</div>
          <div className="dedicated-hours">Dedicated</div>
        </li>
        {items}
      </ul>
    );
  }

  render() {
    return (
      <div className="container">
        {::this._renderStories()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.currentProject }
);

export default connect(mapStateToProps)(ProjectsShowStories);
