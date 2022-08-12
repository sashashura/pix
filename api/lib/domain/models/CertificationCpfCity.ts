// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCpfCity {
  INSEECode: $TSFixMe;
  id: $TSFixMe;
  isActualName: $TSFixMe;
  name: $TSFixMe;
  postalCode: $TSFixMe;
  constructor({
    id,
    name,
    postalCode,
    INSEECode,
    isActualName
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.postalCode = postalCode;
    this.INSEECode = INSEECode;
    this.isActualName = isActualName;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCpfCity;
