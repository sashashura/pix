// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfA... Remove this comment to see the full error message
const BookshelfAssessment = require('../orm-models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'groupBy'.
const { groupBy, map, head, uniqBy, omit } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getWithAnswers(id: $TSFixMe) {
    const [assessment] = await knex('assessments').where('assessments.id', id);
    if (!assessment) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Assessment not found for ID ${id}`);
    }

    const answers = await knex('answers')
      .select('id', 'challengeId', 'value')
      .where('assessmentId', id)
      .orderBy('createdAt');
    assessment.answers = uniqBy(answers, 'challengeId');
    return new Assessment(assessment);
  },

  async get(id: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const assessment = await knexConn('assessments').where({ id }).first();

    if (!assessment) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError("L'assessment n'existe pas ou son accès est restreint");
    }
    return new Assessment(assessment);
  },

  findLastCompletedAssessmentsForEachCompetenceByUser(userId: $TSFixMe, limitDate: $TSFixMe) {
    return BookshelfAssessment.collection()
      .query((qb: $TSFixMe) => {
        qb.join('assessment-results', 'assessment-results.assessmentId', 'assessments.id');
        qb.where({ userId })
          .where(function(this: $TSFixMe) {
            this.where({ type: 'PLACEMENT' });
          })
          .where('assessments.createdAt', '<', limitDate)
          .where('assessment-results.createdAt', '<', limitDate)
          .where('assessments.state', '=', 'completed')
          .orderBy('assessments.createdAt', 'desc');
      })
      .fetch({ require: false })
      .then((bookshelfAssessmentCollection: $TSFixMe) => bookshelfAssessmentCollection.models)
      .then(_selectLastAssessmentForEachCompetence)
      .then((assessments: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfAssessment, assessments));
  },

  getByAssessmentIdAndUserId(assessmentId: $TSFixMe, userId: $TSFixMe) {
    return BookshelfAssessment.query({ where: { id: assessmentId }, andWhere: { userId } })
      .fetch()
      .then((assessment: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfAssessment, assessment))
      .catch((error: $TSFixMe) => {
        if (error instanceof BookshelfAssessment.NotFoundError) {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          throw new NotFoundError();
        }

        throw error;
      });
  },

  async save({
    assessment,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const knexConn = domainTransaction.knexTransaction || knex;
    assessment.validate();
    const [assessmentCreated] = await knexConn('assessments').insert(_adaptModelToDb(assessment)).returning('*');
    return new Assessment(assessmentCreated);
  },

  findNotAbortedCampaignAssessmentsByUserId(userId: $TSFixMe) {
    return BookshelfAssessment.where({ userId, type: 'CAMPAIGN' })
      .where('state', '!=', 'aborted')
      .fetchAll()
      .then((assessments: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfAssessment, assessments));
  },

  abortByAssessmentId(assessmentId: $TSFixMe) {
    return this._updateStateById({ id: assessmentId, state: Assessment.states.ABORTED });
  },

  completeByAssessmentId(assessmentId: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    return this._updateStateById(
      { id: assessmentId, state: Assessment.states.COMPLETED },
      domainTransaction.knexTransaction
    );
  },

  endBySupervisorByAssessmentId(assessmentId: $TSFixMe) {
    return this._updateStateById({ id: assessmentId, state: Assessment.states.ENDED_BY_SUPERVISOR });
  },

  async getByCertificationCandidateId(certificationCandidateId: $TSFixMe) {
    const assessment = await knex('assessments')
      .select('assessments.*')
      .innerJoin('certification-courses', 'certification-courses.id', 'assessments.certificationCourseId')
      .innerJoin('certification-candidates', function(this: $TSFixMe) {
        this.on('certification-candidates.userId', 'certification-courses.userId').andOn(
          'certification-candidates.sessionId',
          'certification-courses.sessionId'
        );
      })
      .where({ 'certification-candidates.id': certificationCandidateId })
      .first();
    return new Assessment({ ...assessment });
  },

  async ownedByUser({
    id,
    userId = null
  }: $TSFixMe) {
    const assessment = await knex('assessments').select('userId').where({ id }).first();

    if (!assessment) {
      return false;
    }

    return assessment.userId === userId;
  },

  async _updateStateById({
    id,
    state
  }: $TSFixMe, knexTransaction: $TSFixMe) {
    const assessment = await BookshelfAssessment.where({ id }).save(
      { state },
      { require: true, patch: true, transacting: knexTransaction }
    );
    return bookshelfToDomainConverter.buildDomainObject(BookshelfAssessment, assessment);
  },

  async updateLastQuestionDate({
    id,
    lastQuestionDate
  }: $TSFixMe) {
    try {
      await BookshelfAssessment.where({ id }).save(
        { lastQuestionDate },
        { require: true, patch: true, method: 'update' }
      );
    } catch (err) {
      if (err instanceof BookshelfAssessment.NoRowsUpdatedError) {
        return null;
      }
      throw err;
    }
  },

  async updateWhenNewChallengeIsAsked({
    id,
    lastChallengeId
  }: $TSFixMe) {
    try {
      await BookshelfAssessment.where({ id }).save(
        { lastChallengeId, lastQuestionState: Assessment.statesOfLastQuestion.ASKED },
        { require: true, patch: true, method: 'update' }
      );
    } catch (err) {
      if (err instanceof BookshelfAssessment.NoRowsUpdatedError) {
        return null;
      }
      throw err;
    }
  },

  async updateLastQuestionState({
    id,
    lastQuestionState,
    domainTransaction
  }: $TSFixMe) {
    try {
      await BookshelfAssessment.where({ id }).save(
        { lastQuestionState },
        { require: true, patch: true, method: 'update', transacting: domainTransaction.knexTransaction }
      );
    } catch (err) {
      if (err instanceof BookshelfAssessment.NoRowsUpdatedError) {
        return null;
      }
      throw err;
    }
  },
};

function _selectLastAssessmentForEachCompetence(bookshelfAssessments: $TSFixMe) {
  const assessmentsGroupedByCompetence = groupBy(bookshelfAssessments, (bookshelfAssessment: $TSFixMe) => bookshelfAssessment.get('competenceId')
  );
  return map(assessmentsGroupedByCompetence, head);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _adaptModelToDb(assessment: $TSFixMe) {
  return omit(assessment, [
    'id',
    'course',
    'createdAt',
    'updatedAt',
    'successRate',
    'answers',
    'targetProfile',
    'campaign',
    'campaignParticipation',
    'title',
    'campaignCode',
  ]);
}
