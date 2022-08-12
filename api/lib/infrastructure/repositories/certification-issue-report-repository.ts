// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../domain/models/CertificationIssueReport');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(certificationIssueReport: $TSFixMe) {
    const [data] = await knex
      .from('certification-issue-reports')
      .insert(omit(certificationIssueReport, ['isImpactful']))
      .onConflict(['id'])
      .merge()
      .returning('*');

    return new CertificationIssueReport(data);
  },

  async get(id: $TSFixMe) {
    const certificationIssueReport = await knex('certification-issue-reports').where({ id }).first();
    return new CertificationIssueReport(certificationIssueReport);
  },

  async findByCertificationCourseId(certificationCourseId: $TSFixMe) {
    const certificationIssueReports = await knex('certification-issue-reports').where({ certificationCourseId });
    return certificationIssueReports.map(
      (certificationIssueReport: $TSFixMe) => new CertificationIssueReport(certificationIssueReport)
    );
  },

  async delete(id: $TSFixMe) {
    return knex('certification-issue-reports').where({ id }).del();
  },
};
