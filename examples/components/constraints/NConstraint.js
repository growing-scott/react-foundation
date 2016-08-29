class NConstraint{
  constructor() {}

  static get SERVER() {
     return "http://localhost:8090";
  }

  static get PRODUCT() {
     return "ITSM";
  }

  static get DEFAULT_OPTION_NAME() {
     return "name";
  }

  static get DEFAULT_OPTION_VALUE() {
     return "value";
  }
}
export default NConstraint;
