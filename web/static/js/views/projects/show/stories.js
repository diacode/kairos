import React, {PropTypes}        from 'react';
import { connect }               from 'react-redux';
import classnames                from 'classnames';
import { setDocumentTitle }      from '../../../utils';
import StoriesFilter             from '../../../components/stories/filter';
import ReactCSSTransitionGroup   from 'react-addons-css-transition-group';
import { filterStories }         from '../../../actions/current_project';

export default class ProjectsShowStories extends React.Component {
  componentDidMount() {
    const { name } = this.props;

    setDocumentTitle(`${name} stories`);
  }

  _renderStories() {
    const { projectStories } = this.props;

    if (projectStories.length == 0) return this._renderNoResults();

    let totalEstimatedHours = 0;
    let totalDedicatedHours = 0;

    const items = projectStories.map((story) => {
      const { id, name, estimate, status, dedicatedHours, estimatedHours } = story;

      totalEstimatedHours += estimatedHours;
      totalDedicatedHours += dedicatedHours;

      const statusClasses = classnames({
        id: true,
        ok: story.underEstimation(),
        error: story.overEstimation(),
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
          <div className="estimation">{estimatedHours}<small>hrs.</small></div>
          <div className="dedicated-hours">{dedicatedHours}<small>hrs.</small></div>
        </li>
      );
    });

    return (
      <ul className="stories-container">
          <li className="header unstyled" key="header">
            <div className="info">Displaying {projectStories.length} stories</div>
            <div className="status"> </div>
            <div className="estimation">Estimated</div>
            <div className="dedicated-hours">Dedicated</div>
          </li>
          {items}
          <li className="footer unstyled" key="footer">
            <div className="info"> </div>
            <div className="status"> </div>
            <div className="estimation">{totalEstimatedHours}hrs.</div>
            <div className="dedicated-hours">{totalDedicatedHours}hrs.</div>
          </li>
      </ul>
    );
  }

  _renderNoResults() {
    return (
      <div className="view-container error-container">
        <i className="fa fa-meh-o"/>
        <p>Oops! No stories found</p>
      </div>
    );
  }

  _handleFilterChange(data) {
    const { dispatch } = this.props;

    dispatch(filterStories(data));
  }

  render() {
    return (
      <div className="container">
        <StoriesFilter onFilterChange={::this._handleFilterChange}/>
        {::this._renderStories()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.currentProject }
);

export default connect(mapStateToProps)(ProjectsShowStories);
