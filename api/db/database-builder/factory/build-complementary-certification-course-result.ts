// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildComplementaryCertificationCourse = require('./build-complementary-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCompl... Remove this comment to see the full error message
const buildComplementaryCertification = require('./build-complementary-certification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCourse = require('./build-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../lib/domain/models/ComplementaryCertificationCourseResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationCourseResult({
  complementaryCertificationCourseId,
  partnerKey,
  source = ComplementaryCertificationCourseResult.sources.PIX,
  acquired = true
}: $TSFixMe) {
  complementaryCertificationCourseId = _.isUndefined(complementaryCertificationCourseId)
    ? _buildComplementaryCertificationCourse().id
    : complementaryCertificationCourseId;
  return databaseBuffer.objectsToInsert.push({
    tableName: 'complementary-certification-course-results',
    values: { complementaryCertificationCourseId, partnerKey, source, acquired },
  });
};

function _buildComplementaryCertificationCourse() {
  const { id: complementaryCertificationId } = buildComplementaryCertification();
  const { id: certificationCourseId } = buildCertificationCourse();
  return buildComplementaryCertificationCourse({
    complementaryCertificationId,
    certificationCourseId,
  });
}
