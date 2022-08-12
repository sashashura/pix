// @ts-expect-error TS(2300): Duplicate identifier 'CertificationsResults'.
class CertificationsResults {
  certifications: $TSFixMe;
  competences: $TSFixMe;
  constructor({
    certifications,
    competences
  }: $TSFixMe = {}) {
    this.certifications = certifications;
    this.competences = competences;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationsResults;
