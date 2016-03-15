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
    const { stories } = this.props;

    const items = stories.map((story) => {
      const { id, name, estimate, current_state } = story;
      const estimatedHours = this._estimatedHours(estimate);
      const dedicatedHours = this._dedicatedHours(story);

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
            <small>{current_state}</small>
          </div>
          <div className="estimation">{estimate | 0}<small>pts.</small> / {estimatedHours}<small>hrs.</small></div>
          <div className="dedicated-hours">{dedicatedHours}<small>hrs.</small></div>
        </li>
      );
    });

    return (
      <ul className="stories-container">
        <li className="header" key="header">
          <div className="id">&#160;</div>
          <div className="name">&#160;</div>
          <div className="status">&#160;</div>
          <div className="estimation">Estimated</div>
          <div className="dedicated-hours">Dedicated</div>
        </li>
        {items}
      </ul>
    );
  }

  _estimatedHours(points) {
    switch (points) {
      case 1:
        return 4;
      case 2:
        return 8;
      case 3:
        return 16;
      default:
        return 0;
    }
  }

  _dedicatedHours(story) {
    const { time_entries } = this.props;
    const id = `#${story.id} ${story.name}`;
    const timeEntry = time_entries.find((item) => {return item.title.time_entry === id;});

    return timeEntry != null ? Math.round(timeEntry.time / 3600000) : 0;
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
