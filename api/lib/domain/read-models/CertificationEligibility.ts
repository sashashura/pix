// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationEligibility {
  eligibleComplementaryCertifications: $TSFixMe;
  id: $TSFixMe;
  pixCertificationEligible: $TSFixMe;
  constructor({
    id,
    pixCertificationEligible,
    eligibleComplementaryCertifications = []
  }: $TSFixMe) {
    this.id = id;
    this.pixCertificationEligible = pixCertificationEligible;
    this.eligibleComplementaryCertifications = eligibleComplementaryCertifications;
  }

  static notCertifiable({
    userId
  }: $TSFixMe) {
    return new CertificationEligibility({ id: userId, pixCertificationEligible: false });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationEligibility;
