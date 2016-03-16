import React, {PropTypes} from 'react';

export default class StoriesFilter extends React.Component {
  _handleFormChange() {
    const { unscheduled, unstarted, started, finished, delivered, rejected, accepted, over, under } = this.refs;

    const statuses = [unscheduled, unstarted, started, finished, delivered, rejected, accepted];
    const estimations = [over, under];

    const filterData = {
      statuses: this._takeChecked(statuses),
      estimations: this._takeChecked(estimations),
    };

    this.props.onFilterChange(filterData);
  }

  _takeChecked(items) {
    return items.filter((item) => {return item.checked;}).map((item) => {return item.value;});
  }

  render() {
    return (
      <div className="filters-container">
        <form>
          <section>
            <header>
              <h3>Story status</h3>
            </header>
            <ul>
              <li>
                <input id="unscheduled" ref="unscheduled" type="checkbox" value="unscheduled" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="unscheduled">Unscheduled</label>
              </li>
              <li>
                <input id="unstarted" ref="unstarted" type="checkbox" value="unstarted" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="unstarted">Unstarted</label>
              </li>
              <li>
                <input id="started" ref="started" type="checkbox" value="started" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="started">Started</label>
              </li>
              <li>
                <input id="finished" ref="finished" type="checkbox" value="finished" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="finished">Finished</label>
              </li>
              <li>
                <input id="delivered" ref="delivered" type="checkbox" value="delivered" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="delivered">Delivered</label>
              </li>
              <li>
                <input id="rejected" ref="rejected" type="checkbox" value="rejected" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="rejected">Rejected</label>
              </li>
              <li>
                <input id="accepted" ref="accepted" type="checkbox" value="accepted" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="accepted">Accepted</label>
              </li>
            </ul>
          </section>
          <section>
            <header>
              <h3>Estimation</h3>
            </header>
            <ul>
              <li>
                <input id="over" ref="over" type="checkbox" value="over" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="over">Over estimation</label>
              </li>
              <li>
                <input id="under" ref="under" type="checkbox" value="under" defaultChecked={true} onClick={::this._handleFormChange}/>
                <label htmlFor="under">Under estimation</label>
              </li>
            </ul>
          </section>
        </form>
      </div>
    );
  }
}
