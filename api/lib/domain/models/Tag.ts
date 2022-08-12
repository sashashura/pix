// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
class Tag {
  static AGRICULTURE = 'AGRICULTURE';

  static POLE_EMPLOI = 'POLE EMPLOI';

  static MEDIATION_NUMERIQUE = 'MEDNUM';

  static CFA = 'CFA';

  static AEFE = 'AEFE';

  static MLF = 'MLF';

  id: $TSFixMe;
  name: $TSFixMe;

  constructor({
    id,
    name
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Tag;
