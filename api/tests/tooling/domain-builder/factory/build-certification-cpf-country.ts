// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCpfCountry = require('../../../../lib/domain/models/CertificationCpfCountry');

function buildCertificationCpfCountry({
  id = 123,
  code = '99139',
  commonName = 'PORTUGAL',
  originalName = 'PORTUGAL',
  matcher = 'AGLOPRTU',
} = {}) {
  return new CertificationCpfCountry({
    id,
    code,
    commonName,
    originalName,
    matcher,
  });
}

buildCertificationCpfCountry.FRANCE = function ({
  id = 123,
  code = '99100',
  commonName = 'FRANCE',
  originalName = 'FRANCE',
  matcher = 'ACEFNR',
} = {}) {
  return new CertificationCpfCountry({
    id,
    code,
    commonName,
    originalName,
    matcher,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertificationCpfCountry;
