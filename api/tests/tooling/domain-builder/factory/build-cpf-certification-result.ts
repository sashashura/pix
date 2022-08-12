// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfCertifi... Remove this comment to see the full error message
const CpfCertificationResult = require('../../../../lib/domain/read-models/CpfCertificationResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCpfCertificationResult({
  id = 1234,
  firstName = 'John',
  lastName = 'Doe',
  birthdate = new Date('2000-01-01'),
  sex = 'M',
  birthINSEECode = '75115',
  birthPostalCode = '75015',
  publishedAt = new Date(),
  pixScore = 100,
  competenceMarks = [
    { competenceCode: '1.2', level: 3 },
    { competenceCode: '2.4', level: 5 },
  ],
} = {}) {
  return new CpfCertificationResult({
    id,
    firstName,
    lastName,
    birthdate,
    sex,
    birthINSEECode,
    birthPostalCode,
    publishedAt,
    pixScore,
    competenceMarks,
  });
};
