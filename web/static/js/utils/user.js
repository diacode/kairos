export default class User {
  constructor(args) {
    this.firstName = args.first_name;
    this.lastName = args.last_name;
    this.email = args.email;
    this.admin = args.admin;
    this.channel = args.channel;
  }

  canFetchProjects() {
    return this.channel !== null;
  }
}
