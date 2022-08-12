// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCpfCountry {
  code: $TSFixMe;
  commonName: $TSFixMe;
  id: $TSFixMe;
  matcher: $TSFixMe;
  originalName: $TSFixMe;
  constructor({
    id,
    code,
    commonName,
    originalName,
    matcher
  }: $TSFixMe = {}) {
    this.id = id;
    this.code = code;
    this.commonName = commonName;
    this.originalName = originalName;
    this.matcher = matcher;
  }

  isFrance() {
    return this.code === '99100';
  }

  isForeign() {
    return this.code !== '99100';
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCpfCountry;
