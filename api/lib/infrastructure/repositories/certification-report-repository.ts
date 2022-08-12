// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationReport = require('../../domain/models/CertificationReport');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourseBookshelf = require('../orm-models/CertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCourseUpdateError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toDomain'.
const { toDomain } = require('./certification-course-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findBySessionId(sessionId: $TSFixMe) {
    const results = await CertificationCourseBookshelf.where({ sessionId })
      .query((qb: $TSFixMe) => {
        qb.orderByRaw('LOWER("lastName") asc');
        qb.orderByRaw('LOWER("firstName") asc');
      })
      .fetchAll({
        withRelated: ['certificationIssueReports', 'assessment'],
      });

    const certificationCourses = results.map(toDomain);
    return _.map(certificationCourses, CertificationReport.fromCertificationCourse);
  },

  async finalizeAll(certificationReports: $TSFixMe) {
    try {
      await Bookshelf.transaction((trx: $TSFixMe) => {
        const finalizeReport = (certificationReport: $TSFixMe) => _finalize({ certificationReport, transaction: trx });
        return bluebird.mapSeries(certificationReports, finalizeReport);
      });
    } catch (err) {
      throw new CertificationCourseUpdateError('An error occurred while finalizing the session');
    }
  },
};

async function _finalize({
  certificationReport,
  transaction = undefined
}: $TSFixMe) {
  const saveOptions = { patch: true, method: 'update' };
  if (transaction) {
    (saveOptions as $TSFixMe).transacting = transaction;
  }

  await new CertificationCourseBookshelf({ id: certificationReport.certificationCourseId }).save(
    { hasSeenEndTestScreen: certificationReport.hasSeenEndTestScreen },
    saveOptions
  );
}
