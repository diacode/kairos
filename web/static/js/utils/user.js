export default class User {
  constructor(args) {
    this.firstName = args.first_name;
    this.lastName = args.last_name;
    this.email = args.email;
    this.settings = args.settings;
    this.channel = null;
  }

  hasValidSettings() {
    return this.settings !== null &&
      this.settings.pivotal_tracker_api_token !== null &&
      this.settings.pivotal_tracker_api_token !== '';
  }

  canFetchProjects() {
    return this.channel !== null && this.hasValidSettings();
  }

  setChannel(channel) {
    this.channel = channel;
  }

  clone() {
    return new User({
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      settings: this.settings,
      channel: this.channel,
    });
  }
}
