// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../../../lib/domain/models/Answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repositories | assessment-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('answers').delete();
    await knex('assessment-results').delete();
    return knex('assessments').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getWithAnswers', function () {
    let assessmentId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment exists', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        assessmentId = databaseBuilder.factory.buildAssessment({
          courseId: 'course_A',
          state: 'completed',
        }).id;

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the assessment with the answers sorted by creation date', async function () {
        //given
        const dateOfFirstAnswer = moment.utc().subtract(3, 'minute').toDate();
        const dateOfSecondAnswer = moment.utc().subtract(2, 'minute').toDate();
        const dateOfThirdAnswer = moment.utc().subtract(1, 'minute').toDate();
        moment.utc().toDate();
        const dateOfFourthAnswer = moment.utc().toDate();

        _.each(
          [
            { assessmentId, value: '3,1', result: 'ko', challengeId: 'challenge_3_1', createdAt: dateOfFirstAnswer },
            { assessmentId, value: '1,4', result: 'ko', challengeId: 'challenge_1_4', createdAt: dateOfSecondAnswer },
            { assessmentId, value: '2,8', result: 'ko', challengeId: 'challenge_2_8', createdAt: dateOfThirdAnswer },
            { assessmentId, value: '2,9', result: 'ko', challengeId: 'challenge_2_8', createdAt: dateOfFourthAnswer },
            { value: '5,2', result: 'ko', challengeId: 'challenge_4' },
          ],
          (answer: $TSFixMe) => {
            databaseBuilder.factory.buildAnswer(answer);
          }
        );
        await databaseBuilder.commit();

        // when
        const assessment = await assessmentRepository.getWithAnswers(assessmentId);

        // then
        expect(assessment).to.be.an.instanceOf(Assessment);
        expect(assessment.id).to.equal(assessmentId);
        expect(assessment.courseId).to.equal('course_A');

        expect(assessment.answers).to.have.lengthOf(3);
        expect(assessment.answers[0]).to.be.an.instanceOf(Answer);
        expect(assessment.answers[0].challengeId).to.equal('challenge_3_1');
        expect(assessment.answers[1].challengeId).to.equal('challenge_1_4');
        expect(assessment.answers[2].challengeId).to.equal('challenge_2_8');
        expect(assessment.answers[2].value).to.equal('2,8');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the assessment with no answers', async function () {
        // when
        const assessment = await assessmentRepository.getWithAnswers(assessmentId);

        // then
        expect(assessment.answers).to.have.lengthOf(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(assessmentRepository.getWithAnswers)(245);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let assessmentId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment exists', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        assessmentId = databaseBuilder.factory.buildAssessment({ courseId: 'course_A' }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the assessment', async function () {
        // when
        const assessment = await assessmentRepository.get(assessmentId);

        // then
        expect(assessment).to.be.an.instanceOf(Assessment);
        expect(assessment.id).to.equal(assessmentId);
        expect(assessment.courseId).to.equal('course_A');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(assessmentRepository.get)(245);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByAssessmentIdAndUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when userId is provided,', function () {
      let userId: $TSFixMe;
      let assessmentId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'before'.
      before(async function () {
        userId = databaseBuilder.factory.buildUser({}).id;
        assessmentId = databaseBuilder.factory.buildAssessment({
          userId,
          courseId: 'courseId',
        }).id;

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should fetch relative assessment ', async function () {
        // when
        const assessment = await assessmentRepository.getByAssessmentIdAndUserId(assessmentId, userId);

        // then
        expect(assessment).to.be.an.instanceOf(Assessment);
        expect(assessment.id).to.equal(assessmentId);
        expect(parseInt(assessment.userId)).to.equal(userId);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when userId is null,', function () {
      const userId = null;
      let assessmentId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'before'.
      before(async function () {
        assessmentId = databaseBuilder.factory.buildAssessment({
          userId,
          courseId: 'courseId',
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should fetch relative assessment', async function () {
        // when
        const assessment = await assessmentRepository.getByAssessmentIdAndUserId(assessmentId, userId);

        // then
        expect(assessment).to.be.an.instanceOf(Assessment);
        expect(assessment.id).to.equal(assessmentId);
        expect(assessment.userId).to.be.null;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findLastCompletedAssessmentsForEachCompetenceByUser', function () {
    let johnUserId: $TSFixMe;
    let laylaUserId;
    let johnAssessmentToRemember: $TSFixMe;

    const PLACEMENT = 'PLACEMENT';
    let lastQuestionDate: $TSFixMe;
    let limitDate: $TSFixMe;

    // TODO: test with malformed data, e.g.:
    // - completed assessments without an AssessmentResult

    // @ts-expect-error TS(2304): Cannot find name 'before'.
    before(async function () {
      limitDate = moment.utc().toDate();

      const afterLimiteDate = moment(limitDate).add(1, 'day').toDate();
      const johnAssessmentResultDateToRemember = moment(limitDate).subtract(1, 'month').toDate();
      const johnAssessmentDateToRemember = moment(limitDate).subtract(2, 'month').toDate();
      const dateAssessmentBefore1 = moment(johnAssessmentDateToRemember).subtract(1, 'month').toDate();
      const dateAssessmentBefore2 = moment(johnAssessmentDateToRemember).subtract(2, 'month').toDate();
      const dateAssessmentBefore3 = moment(johnAssessmentDateToRemember).subtract(3, 'month').toDate();
      const dateAssessmentAfter = afterLimiteDate;

      const dateAssessmentResultBefore1 = moment(johnAssessmentResultDateToRemember).subtract(1, 'month').toDate();
      const dateAssessmentResultBefore2 = moment(johnAssessmentResultDateToRemember).subtract(2, 'month').toDate();
      const dateAssessmentResultBefore3 = moment(johnAssessmentResultDateToRemember).subtract(3, 'month').toDate();

      const dateAssessmentResultAfter1 = moment(afterLimiteDate).add(1, 'month').toDate();
      const dateAssessmentResultAfter2 = moment(afterLimiteDate).add(2, 'month').toDate();

      lastQuestionDate = moment('2021-03-10').toDate();

      johnUserId = databaseBuilder.factory.buildUser().id;
      laylaUserId = databaseBuilder.factory.buildUser().id;

      johnAssessmentToRemember = databaseBuilder.factory.buildAssessment({
        userId: johnUserId,
        competenceId: 'competenceId1',
        state: Assessment.states.COMPLETED,
        createdAt: johnAssessmentDateToRemember,
        type: 'PLACEMENT',
        lastQuestionDate,
        method: 'SMART_RANDOM',
      });
      databaseBuilder.factory.buildAssessmentResult({
        assessmentId: johnAssessmentToRemember.id,
        createdAt: johnAssessmentResultDateToRemember,
        emitter: 'PIX',
        status: AssessmentResult.status.VALIDATED,
      });

      _.each(
        [
          {
            assessment: {
              userId: johnUserId,
              competenceId: 'competenceId1',
              courseId: 'do-not-use-courseId',
              createdAt: dateAssessmentBefore1,
              state: Assessment.states.COMPLETED,
              type: PLACEMENT,
              method: 'SMART_RANDOM',
            },
            assessmentResult: {
              createdAt: dateAssessmentResultBefore1,
              emitter: 'PIX',
              status: AssessmentResult.status.VALIDATED,
            },
          },
          {
            assessment: {
              userId: johnUserId,
              competenceId: 'competenceId2',
              createdAt: dateAssessmentBefore2,
              state: Assessment.states.COMPLETED,
              type: PLACEMENT,
              method: 'SMART_RANDOM',
            },
            assessmentResult: {
              createdAt: dateAssessmentResultAfter1,
              emitter: 'PIX',
              status: AssessmentResult.status.VALIDATED,
            },
          },
          {
            assessment: {
              userId: johnUserId,
              competenceId: 'competenceId3',
              createdAt: dateAssessmentBefore3,
              state: Assessment.states.STARTED,
              type: PLACEMENT,
              method: 'SMART_RANDOM',
            },
            assessmentResult: {
              createdAt: dateAssessmentResultBefore2,
              emitter: 'PIX',
              status: AssessmentResult.status.VALIDATED,
            },
          },
          {
            assessment: {
              userId: johnUserId,
              competenceId: 'competenceId1',
              createdAt: dateAssessmentAfter,
              state: Assessment.states.COMPLETED,
              type: PLACEMENT,
              method: 'SMART_RANDOM',
            },
            assessmentResult: {
              createdAt: dateAssessmentResultAfter2,
              emitter: 'PIX',
              status: AssessmentResult.status.VALIDATED,
            },
          },
          {
            assessment: {
              userId: laylaUserId,
              competenceId: 'competenceId1',
              createdAt: dateAssessmentBefore1,
              state: Assessment.states.COMPLETED,
              type: PLACEMENT,
              method: 'SMART_RANDOM',
            },
            assessmentResult: {
              createdAt: dateAssessmentResultBefore3,
              emitter: 'PIX',
              status: AssessmentResult.status.VALIDATED,
            },
          },
        ],
        ({
          assessment,
          assessmentResult
        }: $TSFixMe) => {
          const assessmentId = databaseBuilder.factory.buildAssessment(assessment).id;
          databaseBuilder.factory.buildAssessmentResult({ ...assessmentResult, assessmentId });
        }
      );

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should correctly query Assessment conditions', async function () {
      // given
      const expectedAssessments = [
        new Assessment({
          id: johnAssessmentToRemember.id,
          userId: johnUserId,
          courseId: 'recDefaultCourseId',
          state: Assessment.states.COMPLETED,
          createdAt: johnAssessmentToRemember.createdAt,
          type: PLACEMENT,
          isImproving: false,
          lastQuestionDate,
          lastChallengeId: null,
          lastQuestionState: Assessment.statesOfLastQuestion.ASKED,
          campaignParticipationId: null,
          certificationCourseId: null,
          competenceId: johnAssessmentToRemember.competenceId,
          assessmentResults: [],
          method: 'SMART_RANDOM',
        }),
      ];

      // when
      const assessments = await assessmentRepository.findLastCompletedAssessmentsForEachCompetenceByUser(
        johnUserId,
        limitDate
      );

      // then
      const assessmentsWithoutUserId = _.map(assessments, (assessment: $TSFixMe) => _.omit(assessment, ['userId', 'updatedAt']));
      const expectedAssessmentsWithoutUserId = _.map(expectedAssessments, (assessment: $TSFixMe) => _.omit(assessment, ['userId', 'updatedAt'])
      );
      expect(assessmentsWithoutUserId).to.deep.equal(expectedAssessmentsWithoutUserId);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    let userId: $TSFixMe;
    let certificationCourseId;
    let assessmentToBeSaved: $TSFixMe;
    let assessmentReturned;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser().id;
      certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ userId }).id;

      assessmentToBeSaved = domainBuilder.buildAssessment({
        userId,
        courseId: certificationCourseId,
        type: Assessment.types.CERTIFICATION,
        state: Assessment.states.COMPLETED,
      });

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save new assessment if not already existing', async function () {
      // when
      assessmentReturned = await assessmentRepository.save({ assessment: assessmentToBeSaved });

      // then
      const assessmentsInDb = await knex('assessments').where('id', assessmentReturned.id).first('id', 'userId');
      expect(parseInt(assessmentsInDb.userId)).to.equal(userId);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findNotAbortedCampaignAssessmentsByUserId', function () {
    let assessmentId: $TSFixMe;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAssessment({
        userId,
        type: Assessment.types.CAMPAIGN,
        state: Assessment.states.ABORTED,
      });

      assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        type: Assessment.types.CAMPAIGN,
      }).id;

      await databaseBuilder.commit();
    });

    // TODO: Fix this the next time the file is edited.
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    // eslint-disable-next-line mocha/no-sibling-hooks
    beforeEach(async function () {
      databaseBuilder.factory.buildCampaignParticipation({
        userId,
        assessmentId,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the assessment with campaign when it matches with userId and ignore aborted assessments', async function () {
      // when
      const assessmentsReturned = await assessmentRepository.findNotAbortedCampaignAssessmentsByUserId(userId);

      // then
      expect(assessmentsReturned.length).to.equal(1);
      expect(assessmentsReturned[0]).to.be.an.instanceOf(Assessment);
      expect(assessmentsReturned[0].id).to.equal(assessmentId);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#completeByAssessmentId', function () {
    let assessmentId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const userId = databaseBuilder.factory.buildUser().id;

      assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        type: Assessment.types.COMPETENCE_EVALUATION,
        state: Assessment.states.STARTED,
      }).id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should complete an assessment if not already existing and commited', async function () {
      // when
      await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        await assessmentRepository.completeByAssessmentId(assessmentId, domainTransaction);
      });

      // then
      const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('state');
      expect(assessmentsInDb.state).to.equal(Assessment.states.COMPLETED);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not complete an assessment if not already existing but rolled back', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async () => {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await assessmentRepository.completeByAssessmentId(assessmentId, domainTransaction);
          throw new Error('an error occurs within the domain transaction');
        });
      });

      // then
      const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('state');
      expect(assessmentsInDb.state).to.equal(Assessment.states.STARTED);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#endBySupervisorByAssessmentId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should end an assessment', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;

      const assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        type: Assessment.types.COMPETENCE_EVALUATION,
        state: Assessment.states.STARTED,
      }).id;

      await databaseBuilder.commit();

      // when
      await assessmentRepository.endBySupervisorByAssessmentId(assessmentId);

      // then
      const { state } = await knex('assessments').where('id', assessmentId).first('state');
      expect(state).to.equal(Assessment.states.ENDED_BY_SUPERVISOR);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#ownedByUser', function () {
    let user: $TSFixMe;
    let userWithNoAssessment: $TSFixMe;
    let assessment: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      user = databaseBuilder.factory.buildUser();
      assessment = databaseBuilder.factory.buildAssessment({ userId: user.id });
      userWithNoAssessment = databaseBuilder.factory.buildUser();
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve true if the given assessmentId belongs to the user', async function () {
      // when
      const ownedByUser = await assessmentRepository.ownedByUser({ id: assessment.id, userId: user.id });

      // then
      expect(ownedByUser).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve false if the given assessmentId does not belong to the user', async function () {
      // when
      const ownedByUser = await assessmentRepository.ownedByUser({
        id: assessment.id,
        userId: userWithNoAssessment.id,
      });

      // then
      expect(ownedByUser).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve true if the given assessmentId does not belong to any user and no user is specified', async function () {
      // given
      const assessmentWithoutUser = databaseBuilder.factory.buildAssessment({ userId: null });
      await databaseBuilder.commit();

      // when
      const ownedByUser = await assessmentRepository.ownedByUser({ id: assessmentWithoutUser.id, userId: null });

      // then
      expect(ownedByUser).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve false if no assessment exists for provided assessmentId', async function () {
      // when
      const ownedByUser = await assessmentRepository.ownedByUser({ id: 123456, userId: 123 });

      // then
      expect(ownedByUser).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateLastQuestionDate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update lastQuestionDate', async function () {
      // given
      const lastQuestionDate = new Date();
      const assessment = databaseBuilder.factory.buildAssessment({
        lastQuestionDate: new Date('2020-01-10'),
      });
      await databaseBuilder.commit();

      // when
      await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate });

      // then
      const assessmentsInDb = await knex('assessments').where('id', assessment.id).first('lastQuestionDate');
      expect(assessmentsInDb.lastQuestionDate).to.deep.equal(lastQuestionDate);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        const lastQuestionDate = new Date();
        const notExistingAssessmentId = 1;

        // when
        const result = await assessmentRepository.updateLastQuestionDate({
          id: notExistingAssessmentId,
          lastQuestionDate,
        });

        // then
        expect(result).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateWhenNewChallengeIsAsked', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update lastChallengeId', async function () {
      // given
      const lastChallengeId = 'recLastChallenge';
      const assessment = databaseBuilder.factory.buildAssessment({
        lastChallengeId: 'recPreviousChallenge',
        lastQuestionState: 'focusedout',
      });
      await databaseBuilder.commit();

      // when
      await assessmentRepository.updateWhenNewChallengeIsAsked({ id: assessment.id, lastChallengeId });

      // then
      const assessmentsInDb = await knex('assessments').where('id', assessment.id).first();
      expect(assessmentsInDb.lastChallengeId).to.deep.equal(lastChallengeId);
      expect(assessmentsInDb.lastQuestionState).to.deep.equal(Assessment.statesOfLastQuestion.ASKED);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        const notExistingAssessmentId = 1;

        // when
        const result = await assessmentRepository.updateWhenNewChallengeIsAsked({
          id: notExistingAssessmentId,
          lastChallengeId: 'test',
        });

        // then
        expect(result).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateLastQuestionState', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update updateLastQuestionState', async function () {
      // given
      const assessment = databaseBuilder.factory.buildAssessment({
        lastQuestionState: Assessment.statesOfLastQuestion.ASKED,
      });
      await databaseBuilder.commit();

      const lastQuestionState = 'timeout';

      // when
      await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        await assessmentRepository.updateLastQuestionState({ id: assessment.id, lastQuestionState, domainTransaction });
      });

      // then
      const assessmentsInDb = await knex('assessments').where('id', assessment.id).first('lastQuestionState');
      expect(assessmentsInDb.lastQuestionState).to.equal(lastQuestionState);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        const notExistingAssessmentId = 1;
        let result;

        // when
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          result = await assessmentRepository.updateLastQuestionState({
            id: notExistingAssessmentId,
            lastQuestionState: 'timeout',
            domainTransaction,
          });
        });

        // then
        expect(result).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCertificationCandidateId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return the user's assessment given its certification candidate id", async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession({}).id;
      const firstUserId = databaseBuilder.factory.buildUser({}).id;
      const secondUserId = databaseBuilder.factory.buildUser({}).id;

      const certificationCandidateId = databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        userId: firstUserId,
      }).id;

      const firstUserCertificationCourse = databaseBuilder.factory.buildCertificationCourse({
        sessionId,
        userId: firstUserId,
      }).id;
      const secondUserCertificationCourse = databaseBuilder.factory.buildCertificationCourse({
        sessionId,
        userId: secondUserId,
      }).id;

      const firstUserAssessmentId = databaseBuilder.factory.buildAssessment({
        userId: firstUserId,
        certificationCourseId: firstUserCertificationCourse,
        state: 'started',
        type: 'CERTIFICATION',
      }).id;
      databaseBuilder.factory.buildAssessment({
        userId: secondUserId,
        certificationCourseId: secondUserCertificationCourse,
        state: 'started',
        type: 'CERTIFICATION',
      });

      await databaseBuilder.commit();

      // when
      const assessment = await assessmentRepository.getByCertificationCandidateId(certificationCandidateId);

      // then
      expect(assessment).to.be.an.instanceOf(Assessment);
      expect(assessment.id).to.equal(firstUserAssessmentId);
      expect(assessment.certificationCourseId).to.equal(firstUserCertificationCourse);
      expect(assessment.userId).to.equal(firstUserId);
      expect(assessment.state).to.equal('started');
    });
  });
});
