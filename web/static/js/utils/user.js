export default class User {
  constructor(args) {
    this.firstName = args.first_name;
    this.lastName = args.last_name;
    this.email = args.email;
    this.settings = args.settings;
    this.channel = args.channel;
  }

  hasValidSettings() {
    return this.settings !== null &&
      this.settings.pivotal_tracker_api_token !== null &&
      this.settings.pivotal_tracker_api_token !== '';
  }

  canFetchProjects() {
    return this.channel !== null && this.hasValidSettings();
  }
}