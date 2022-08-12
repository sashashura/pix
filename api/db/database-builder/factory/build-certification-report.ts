// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCourse = require('./build-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationReport = require('../../../lib/domain/models/CertificationReport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationReport({
  firstName = 'Bobby',
  lastName = 'Lapointe',
  isCompleted = true,
  hasSeenEndTestScreen = false,
  certificationCourseId,
  sessionId,
  abortReason = null
}: $TSFixMe = {}) {
  certificationCourseId = _.isUndefined(certificationCourseId)
    ? buildCertificationCourse({ firstName, lastName, sessionId, hasSeenEndTestScreen }).id
    : certificationCourseId;

  const id = CertificationReport.idFromCertificationCourseId(certificationCourseId);

  const values = {
    id,
    firstName,
    lastName,
    isCompleted,
    hasSeenEndTestScreen,
    certificationCourseId,
    abortReason,
  };
  return values;
};
