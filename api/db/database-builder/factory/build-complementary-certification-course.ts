// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCompl... Remove this comment to see the full error message
const buildComplementaryCertification = require('./build-complementary-certification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationCourse({
  id = databaseBuffer.getNextId(),
  complementaryCertificationId,
  certificationCourseId,
  createdAt = new Date('2020-01-01')
}: $TSFixMe = {}) {
  complementaryCertificationId = complementaryCertificationId
    ? complementaryCertificationId
    : buildComplementaryCertification().id;
  const values = {
    id,
    complementaryCertificationId,
    certificationCourseId,
    createdAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'complementary-certification-courses',
    values,
  });
};
