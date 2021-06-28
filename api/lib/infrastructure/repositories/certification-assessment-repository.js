const _ = require('lodash');
const DomainTransaction = require('../DomainTransaction');
const CertificationAssessment = require('../../domain/models/CertificationAssessment');
const CertificationChallengeWithType = require('../../domain/models/CertificationChallengeWithType');
const Answer = require('../../domain/models/Answer');
const challengeRepository = require('./challenge-repository');
const answerStatusDatabaseAdapter = require('../adapters/answer-status-database-adapter');
const { knex } = require('../bookshelf');
const { NotFoundError } = require('../../domain/errors');

async function _getCertificationChallengesWithIndex(certificationCourseId, knexConn) {
  const allChallenges = await challengeRepository.findOperative();
  const certificationChallengeRows = await knexConn('certification-challenges')
    .where({ courseId: certificationCourseId });

  return _.map(certificationChallengeRows, (certificationChallengeRow) => {
    const challenge = _.find(allChallenges, { id: certificationChallengeRow.challengeId });
    const certificationChallenge = new CertificationChallengeWithType({
      ...certificationChallengeRow,
      type: challenge?.type,
    });
    return {
      index: certificationChallengeRow.index,
      certificationChallenge,
    };
  });
}

async function _getCertificationAnswersByDate(certificationAssessmentId, knexConn) {
  const answerRows = await knexConn('answers')
    .where({ assessmentId: certificationAssessmentId })
    .orderBy('createdAt');

  return _.map(answerRows, (answerRow) => new Answer({
    ...answerRow,
    result: answerStatusDatabaseAdapter.fromSQLString(answerRow.result),
  }));
}

module.exports = {

  async get(id) {
    const certificationAssessmentRows = await knex('assessments')
      .join('certification-courses', 'certification-courses.id', 'assessments.certificationCourseId')
      .select({
        id: 'assessments.id',
        userId: 'assessments.userId',
        certificationCourseId: 'certification-courses.id',
        createdAt: 'certification-courses.createdAt',
        completedAt: 'certification-courses.completedAt',
        isV2Certification: 'certification-courses.isV2Certification',
        state: 'assessments.state',
      })
      .where('assessments.id', '=', id)
      .limit(1);
    if (!certificationAssessmentRows[0]) {
      throw new NotFoundError(`L'assessment de certification ${id} n'existe pas ou son accès est restreint`);
    }
    const certificationChallengesWithIndex = await _getCertificationChallengesWithIndex(certificationAssessmentRows[0].certificationCourseId, knex);
    const certificationAnswersByDate = await _getCertificationAnswersByDate(certificationAssessmentRows[0].id, knex);

    return new CertificationAssessment({
      ...certificationAssessmentRows[0],
      certificationChallengesWithIndex,
      certificationAnswersByDate,
    });
  },

  async getByCertificationCourseId({ certificationCourseId, domainTransaction = DomainTransaction.emptyTransaction() }) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const certificationAssessmentRow = await knexConn('assessments')
      .join('certification-courses', 'certification-courses.id', 'assessments.certificationCourseId')
      .select({
        id: 'assessments.id',
        userId: 'assessments.userId',
        certificationCourseId: 'certification-courses.id',
        createdAt: 'certification-courses.createdAt',
        completedAt: 'certification-courses.completedAt',
        isV2Certification: 'certification-courses.isV2Certification',
        state: 'assessments.state',
      })
      .where('assessments.certificationCourseId', '=', certificationCourseId)
      .first();
    if (!certificationAssessmentRow) {
      throw new NotFoundError(`L'assessment de certification avec un certificationCourseId de ${certificationCourseId} n'existe pas ou son accès est restreint`);
    }
    const certificationChallengesWithIndex = await _getCertificationChallengesWithIndex(certificationAssessmentRow.certificationCourseId, knexConn);
    const certificationAnswersByDate = await _getCertificationAnswersByDate(certificationAssessmentRow.id, knexConn);

    return new CertificationAssessment({
      ...certificationAssessmentRow,
      certificationChallengesWithIndex,
      certificationAnswersByDate,
    });
  },

  async save(certificationAssessment) {
    for (const challenge of certificationAssessment.certificationChallengesInTestOrder()) {
      await knex('certification-challenges')
        .where({ id: challenge.id })
        .update(_.pick(challenge, ['isNeutralized']));
    }
  },

};
