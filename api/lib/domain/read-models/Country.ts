// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Country'.
class Country {
  code: $TSFixMe;
  matcher: $TSFixMe;
  name: $TSFixMe;
  constructor({
    code,
    name,
    matcher
  }: $TSFixMe) {
    this.code = code;
    this.name = name;
    this.matcher = matcher;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  Country,
};
