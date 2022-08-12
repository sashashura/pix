// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Student'.
const Student = require('../../domain/models/Student');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  _toStudents(results: $TSFixMe) {
    const students = [];
    const resultsGroupedByNatId = _.groupBy(results, 'nationalStudentId');
    for (const [nationalStudentId, accounts] of Object.entries(resultsGroupedByNatId)) {
      const mostRelevantAccount = _.orderBy(accounts, ['certificationCount', 'updatedAt'], ['desc', 'desc'])[0];
      students.push(
        new Student({
          nationalStudentId,
          account: _.pick(mostRelevantAccount, [
            'userId',
            'certificationCount',
            'organizationId',
            'birthdate',
            'updatedAt',
          ]),
        })
      );
    }
    return students;
  },

  async findReconciledStudentsByNationalStudentId(
    nationalStudentIds: $TSFixMe,
    domainTransaction = DomainTransaction.emptyTransaction()
  ) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const results = await knexConn
      .select({
        nationalStudentId: 'organization-learners.nationalStudentId',
        userId: 'users.id',
        birthdate: 'organization-learners.birthdate',
        organizationId: 'organization-learners.organizationId',
        updatedAt: 'users.updatedAt',
      })
      .count('certification-courses.id as certificationCount')
      .from('organization-learners')
      .join('users', 'users.id', 'organization-learners.userId')
      .leftJoin('certification-courses', 'certification-courses.userId', 'users.id')
      .whereIn('nationalStudentId', nationalStudentIds)
      .groupBy(
        'organization-learners.nationalStudentId',
        'users.id',
        'organization-learners.organizationId',
        'organization-learners.birthdate',
        'users.updatedAt'
      )
      .orderBy('users.id');

    return this._toStudents(results);
  },

  async getReconciledStudentByNationalStudentId(nationalStudentId: $TSFixMe) {
    const [result] = await this.findReconciledStudentsByNationalStudentId([nationalStudentId]);

    return result ?? null;
  },
};
