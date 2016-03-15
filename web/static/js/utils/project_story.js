export default class ProjectStory {
  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.estimate = params.estimate;
    this.estimatedHours = this._calculateEstimatedHours(params.estimate);
    this.status = params.status;
    this.dedicatedHours = params.dedicatedHours;
  }

  _calculateEstimatedHours() {
    switch (this.estimate) {
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
}
