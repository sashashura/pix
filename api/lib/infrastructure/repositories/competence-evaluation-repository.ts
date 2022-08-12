// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfCompetenceEvaluation = require('../orm-models/CompetenceEvaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save({
    competenceEvaluation,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    let competenceEvaluationCreated = await _getByCompetenceIdAndUserId({
      competenceId: competenceEvaluation.competenceId,
      userId: competenceEvaluation.userId,
      domainTransaction,
    });
    if (competenceEvaluationCreated) {
      return competenceEvaluationCreated;
    } else {
      competenceEvaluationCreated = await new BookshelfCompetenceEvaluation(
        _.omit(competenceEvaluation, ['assessment', 'scorecard'])
      )
        .save(null, { transacting: domainTransaction.knexTransaction })
        .then((result: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfCompetenceEvaluation, result));
    }
    return competenceEvaluationCreated;
  },

  updateStatusByAssessmentId({
    assessmentId,
    status
  }: $TSFixMe) {
    return BookshelfCompetenceEvaluation.where({ assessmentId })
      .save({ status }, { require: true, patch: true })
      .then((updatedCompetenceEvaluation: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfCompetenceEvaluation, updatedCompetenceEvaluation)
      );
  },

  updateStatusByUserIdAndCompetenceId({
    userId,
    competenceId,
    status
  }: $TSFixMe) {
    return BookshelfCompetenceEvaluation.where({ userId, competenceId })
      .save({ status }, { require: true, patch: true })
      .then((updatedCompetenceEvaluation: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfCompetenceEvaluation, updatedCompetenceEvaluation)
      );
  },

  updateAssessmentId({
    currentAssessmentId,
    newAssessmentId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    return BookshelfCompetenceEvaluation.where({ assessmentId: currentAssessmentId })
      .save(
        { assessmentId: newAssessmentId },
        { require: true, patch: true, transacting: domainTransaction.knexTransaction }
      )
      .then((updatedCompetenceEvaluation: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfCompetenceEvaluation, updatedCompetenceEvaluation)
      );
  },

  getByAssessmentId(assessmentId: $TSFixMe) {
    return BookshelfCompetenceEvaluation.where({ assessmentId })
      .orderBy('createdAt', 'asc')
      .fetch({ withRelated: ['assessment'] })
      .then((result: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfCompetenceEvaluation, result))
      .catch((bookshelfError: $TSFixMe) => {
        if (bookshelfError instanceof BookshelfCompetenceEvaluation.NotFoundError) {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          throw new NotFoundError();
        }
        throw bookshelfError;
      });
  },

  async getByCompetenceIdAndUserId({
    competenceId,
    userId,
    domainTransaction = DomainTransaction.emptyTransaction(),
    forUpdate = false
  }: $TSFixMe) {
    const competenceEvaluation = await _getByCompetenceIdAndUserId({
      competenceId,
      userId,
      domainTransaction,
      forUpdate,
    });
    if (competenceEvaluation === null) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      throw new NotFoundError();
    }
    return competenceEvaluation;
  },

  findByUserId(userId: $TSFixMe) {
    return BookshelfCompetenceEvaluation.where({ userId })
      .orderBy('createdAt', 'asc')
      .fetchAll({ withRelated: ['assessment'] })
      .then((results: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfCompetenceEvaluation, results))
      .then(_selectOnlyOneCompetenceEvaluationByCompetence);
  },

  findByAssessmentId(assessmentId: $TSFixMe) {
    return BookshelfCompetenceEvaluation.where({ assessmentId })
      .orderBy('createdAt', 'asc')
      .fetchAll()
      .then((results: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfCompetenceEvaluation, results));
  },

  async existsByCompetenceIdAndUserId({
    competenceId,
    userId
  }: $TSFixMe) {
    const competenceEvaluation = await _getByCompetenceIdAndUserId({ competenceId, userId });
    return competenceEvaluation ? true : false;
  },
};

async function _getByCompetenceIdAndUserId({
  competenceId,
  userId,
  domainTransaction = DomainTransaction.emptyTransaction(),
  forUpdate = false
}: $TSFixMe) {
  try {
    const result = await BookshelfCompetenceEvaluation.where({ competenceId, userId })
      .orderBy('createdAt', 'asc')
      .fetch({
        transacting: domainTransaction.knexTransaction,
        lock: forUpdate ? 'forUpdate' : undefined,
      });

    await result.related('assessment').fetch();

    return bookshelfToDomainConverter.buildDomainObject(BookshelfCompetenceEvaluation, result);
  } catch (bookshelfError) {
    if (bookshelfError instanceof BookshelfCompetenceEvaluation.NotFoundError) {
      return null;
    }
    throw bookshelfError;
  }
}

function _selectOnlyOneCompetenceEvaluationByCompetence(competenceEvaluations: $TSFixMe) {
  const assessmentsGroupedByCompetence = _.groupBy(competenceEvaluations, 'competenceId');
  return _.map(assessmentsGroupedByCompetence, _.head);
}
