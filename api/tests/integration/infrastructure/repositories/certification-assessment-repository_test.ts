// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAssessmentRepository = require('../../../../lib/infrastructure/repositories/certification-assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessment = require('../../../../lib/domain/models/CertificationAssessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
const Challenge = require('../../../../lib/domain/models/Challenge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repositories | certification-assessment-repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    const learningContent = {
      areas: [
        {
          id: 'recArea1',
          titleFrFr: 'area1_Title',
          competenceIds: ['recArea1_Competence1'],
        },
      ],
      competences: [
        {
          id: 'recArea1_Competence1',
          nameFrFr: 'competence1_1_name',
          index: 'competence1_1_index',
          areaId: 'recArea1',
          skillIds: ['recArea1_Competence1_Tube1_Skill1', 'recArea1_Competence1_Tube1_Skill2'],
        },
      ],
      tubes: [
        {
          id: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
          practicalTitleFrFr: 'tube1_1_1_practicalTitle',
          practicalDescriptionFrFr: 'tube1_1_1_practicalDescription',
        },
      ],
      skills: [
        {
          id: 'recArea1_Competence1_Tube1_Skill1',
          name: 'skill1_1_1_1_name',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
          tutorialIds: [],
        },
        {
          id: 'recArea1_Competence1_Tube1_Skill2',
          name: 'skill1_1_1_2_name',
          status: 'actif',
          tubeId: 'recArea1_Competence1_Tube1',
          competenceId: 'recArea1_Competence1',
          tutorialIds: [],
        },
      ],
      challenges: [
        {
          id: 'recChalA',
          type: Challenge.Type.QCU,
          status: 'validé',
          skillId: 'recArea1_Competence1_Tube1_Skill1',
        },
        {
          id: 'recChalB',
          type: Challenge.Type.QCM,
          status: 'archivé',
          skillId: 'recArea1_Competence1_Tube1_Skill2',
        },
      ],
    };
    mockLearningContent(learningContent);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let certificationAssessmentId: $TSFixMe;
    let expectedCertificationCourseId: $TSFixMe;
    let expectedUserId: $TSFixMe;
    let expectedState: $TSFixMe;
    let expectedCreatedAt;
    let expectedCompletedAt;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification assessment exists', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        expectedState = CertificationAssessment.states.COMPLETED;
        expectedCreatedAt = new Date('2020-01-01T00:00:00Z');
        expectedCompletedAt = new Date('2020-01-02T00:00:00Z');

        const dbf = databaseBuilder.factory;
        expectedUserId = dbf.buildUser().id;
        expectedCertificationCourseId = dbf.buildCertificationCourse({
          userId: expectedUserId,
          createdAt: expectedCreatedAt,
          completedAt: expectedCompletedAt,
          isV2Certification: true,
        }).id;
        certificationAssessmentId = dbf.buildAssessment({
          userId: expectedUserId,
          certificationCourseId: expectedCertificationCourseId,
          state: expectedState,
        }).id;
        dbf.buildAnswer({ assessmentId: certificationAssessmentId, challengeId: 'recChalA' });
        dbf.buildAnswer({ assessmentId: certificationAssessmentId, challengeId: 'recChalB' });
        dbf.buildAnswer({ assessmentId: certificationAssessmentId, challengeId: 'recChalB' });
        dbf.buildCertificationChallenge({
          challengeId: 'recChalA',
          courseId: expectedCertificationCourseId,
          isNeutralized: true,
        });
        dbf.buildCertificationChallenge({ challengeId: 'recChalB', courseId: expectedCertificationCourseId });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the certification assessment with certification challenges and answers', async function () {
        // when
        const certificationAssessment = await certificationAssessmentRepository.get(certificationAssessmentId);

        // then
        expect(certificationAssessment).to.be.an.instanceOf(CertificationAssessment);
        expect(certificationAssessment.id).to.equal(certificationAssessmentId);
        expect(certificationAssessment.userId).to.equal(expectedUserId);
        expect(certificationAssessment.certificationCourseId).to.equal(expectedCertificationCourseId);
        expect(certificationAssessment.state).to.equal(expectedState);
        expect(certificationAssessment.isV2Certification).to.be.true;

        expect(certificationAssessment.certificationAnswersByDate).to.have.length(2);
        expect(certificationAssessment.certificationChallenges).to.have.length(2);
        expect(certificationAssessment.certificationChallenges[0].isNeutralized).to.be.true;
        expect(certificationAssessment.certificationChallenges[0].type).to.equal(Challenge.Type.QCU);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(certificationAssessmentRepository.get)(12345);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCertificationCourseId', function () {
    let expectedCertificationAssessmentId: $TSFixMe;
    let certificationCourseId: $TSFixMe;
    let expectedUserId: $TSFixMe;
    let expectedState: $TSFixMe;
    let expectedCreatedAt;
    let expectedCompletedAt;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification assessment exists', function () {
      let firstAnswerInTime: $TSFixMe;
      let secondAnswerInTime: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        expectedState = CertificationAssessment.states.COMPLETED;
        expectedCreatedAt = new Date('2020-01-01T00:00:00Z');
        expectedCompletedAt = new Date('2020-01-02T00:00:00Z');

        const dbf = databaseBuilder.factory;
        expectedUserId = dbf.buildUser().id;
        certificationCourseId = dbf.buildCertificationCourse({
          userId: expectedUserId,
          createdAt: expectedCreatedAt,
          completedAt: expectedCompletedAt,
          isV2Certification: true,
        }).id;
        expectedCertificationAssessmentId = dbf.buildAssessment({
          userId: expectedUserId,
          certificationCourseId: certificationCourseId,
          state: expectedState,
        }).id;

        // secondAnswerInTime must be inserted in DB before firstAnswerInTime so we can ensure that ordering is based on createdAt
        secondAnswerInTime = dbf.buildAnswer({
          assessmentId: expectedCertificationAssessmentId,
          createdAt: new Date('2020-06-24T00:00:01Z'),
          challengeId: 'recChalA',
        }).id;

        firstAnswerInTime = dbf.buildAnswer({
          assessmentId: expectedCertificationAssessmentId,
          createdAt: new Date('2020-06-24T00:00:00Z'),
          challengeId: 'recChalB',
        }).id;

        dbf.buildAnswer({
          assessmentId: expectedCertificationAssessmentId,
          createdAt: new Date('2020-06-25T00:00:01Z'),
          challengeId: 'recChalA',
        });
        dbf.buildCertificationChallenge({ challengeId: 'recChalA', courseId: certificationCourseId, id: 123 });
        dbf.buildCertificationChallenge({ challengeId: 'recChalB', courseId: certificationCourseId, id: 456 });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the certification assessment with certification challenges and answers', async function () {
        // when
        const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
          certificationCourseId,
        });

        // then
        expect(certificationAssessment).to.be.an.instanceOf(CertificationAssessment);
        expect(certificationAssessment.id).to.equal(expectedCertificationAssessmentId);
        expect(certificationAssessment.userId).to.equal(expectedUserId);
        expect(certificationAssessment.certificationCourseId).to.equal(certificationCourseId);
        expect(certificationAssessment.state).to.equal(expectedState);
        expect(certificationAssessment.isV2Certification).to.be.true;

        expect(certificationAssessment.certificationAnswersByDate).to.have.length(2);
        expect(certificationAssessment.certificationChallenges).to.have.length(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the certification answers ordered by date', async function () {
        // when
        const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
          certificationCourseId,
        });

        // then
        expect(_.map(certificationAssessment.certificationAnswersByDate, 'id')).to.deep.equal([
          firstAnswerInTime,
          secondAnswerInTime,
        ]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the certification challenges ordered by id', async function () {
        // when
        const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
          certificationCourseId,
        });

        // then
        expect(_.map(certificationAssessment.certificationChallenges, 'challengeId')).to.deep.equal([
          'recChalA',
          'recChalB',
        ]);
        expect(_.map(certificationAssessment.certificationChallenges, 'type')).to.deep.equal([
          Challenge.Type.QCU,
          Challenge.Type.QCM,
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(certificationAssessmentRepository.getByCertificationCourseId)({
          certificationCourseId: 12345,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('persists the mutation of neutralized certification challenges', async function () {
      // given
      const dbf = databaseBuilder.factory;
      const userId = dbf.buildUser().id;
      const certificationCourseId = dbf.buildCertificationCourse({ userId }).id;
      const certificationAssessmentId = dbf.buildAssessment({
        userId,
        certificationCourseId,
      }).id;
      dbf.buildAnswer({ assessmentId: certificationAssessmentId });
      dbf.buildAnswer({ assessmentId: certificationAssessmentId });

      const certificationChallenge1RecId = 'rec1234';
      const certificationChallenge2RecId = 'rec567';
      dbf.buildCertificationChallenge({
        challengeId: certificationChallenge1RecId,
        courseId: certificationCourseId,
        isNeutralized: false,
      });
      dbf.buildCertificationChallenge({
        challengeId: certificationChallenge2RecId,
        courseId: certificationCourseId,
        isNeutralized: false,
      });
      dbf.buildCertificationChallenge({
        challengeId: 'rec8910',
        courseId: certificationCourseId,
        isNeutralized: false,
      });

      await databaseBuilder.commit();
      const certificationAssessmentToBeSaved = await certificationAssessmentRepository.get(certificationAssessmentId);

      // when
      certificationAssessmentToBeSaved.neutralizeChallengeByRecId(certificationChallenge1RecId);
      certificationAssessmentToBeSaved.neutralizeChallengeByRecId(certificationChallenge2RecId);
      await certificationAssessmentRepository.save(certificationAssessmentToBeSaved);

      // then
      const persistedCertificationAssessment = await certificationAssessmentRepository.get(certificationAssessmentId);
      expect(persistedCertificationAssessment.certificationChallenges[0].isNeutralized).to.be.true;
      expect(persistedCertificationAssessment.certificationChallenges[1].isNeutralized).to.be.true;
      expect(persistedCertificationAssessment.certificationChallenges[2].isNeutralized).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('persists the mutation of skipped certification challenges', async function () {
      // given
      const dbf = databaseBuilder.factory;
      const userId = dbf.buildUser().id;
      const certificationCourseId = dbf.buildCertificationCourse({ userId }).id;
      const certificationAssessmentId = dbf.buildAssessment({
        userId,
        certificationCourseId,
      }).id;
      dbf.buildAnswer({ assessmentId: certificationAssessmentId, challengeId: 'rec1234' });
      dbf.buildAnswer({ assessmentId: certificationAssessmentId });

      const certificationChallenge1RecId = 'rec1234';
      const certificationChallenge2RecId = 'rec567';
      dbf.buildCertificationChallenge({
        challengeId: certificationChallenge1RecId,
        courseId: certificationCourseId,
        isSkipped: false,
      });
      dbf.buildCertificationChallenge({
        challengeId: certificationChallenge2RecId,
        courseId: certificationCourseId,
        isSkipped: false,
      });

      await databaseBuilder.commit();
      const certificationAssessmentToBeSaved = await certificationAssessmentRepository.get(certificationAssessmentId);

      // when
      certificationAssessmentToBeSaved.certificationChallenges.map((certificationChallenge: $TSFixMe) => {
        if (certificationChallenge.challengeId === 'rec567') {
          certificationChallenge.hasBeenSkippedAutomatically = true;
        }
      });
      await certificationAssessmentRepository.save(certificationAssessmentToBeSaved);

      // then
      const persistedCertificationAssessment = await certificationAssessmentRepository.get(certificationAssessmentId);
      expect(persistedCertificationAssessment.certificationChallenges[0].hasBeenSkippedAutomatically).to.be.false;
      expect(persistedCertificationAssessment.certificationChallenges[1].hasBeenSkippedAutomatically).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('persists the mutation of focused out answers', async function () {
      // given
      const dbf = databaseBuilder.factory;
      const userId = dbf.buildUser().id;
      const certificationCourseId = dbf.buildCertificationCourse({ userId }).id;
      const certificationAssessmentId = dbf.buildAssessment({
        userId,
        certificationCourseId,
      }).id;
      const certificationChallenge1RecId = 'rec1234';
      const certificationChallenge2RecId = 'rec567';

      dbf.buildAnswer({
        assessmentId: certificationAssessmentId,
        challengeId: certificationChallenge1RecId,
        result: 'focusedOut',
        createdAt: new Date('2022-01-01'),
      });
      dbf.buildCertificationChallenge({
        challengeId: certificationChallenge1RecId,
        courseId: certificationCourseId,
      });
      dbf.buildAnswer({
        assessmentId: certificationAssessmentId,
        challengeId: certificationChallenge2RecId,
        result: 'aband',
        createdAt: new Date('2022-01-02'),
      });
      dbf.buildCertificationChallenge({
        challengeId: certificationChallenge2RecId,
        courseId: certificationCourseId,
      });

      await databaseBuilder.commit();
      const certificationAssessmentToBeSaved = await certificationAssessmentRepository.get(certificationAssessmentId);

      certificationAssessmentToBeSaved.validateAnswerByNumberIfFocusedOut(1);
      certificationAssessmentToBeSaved.validateAnswerByNumberIfFocusedOut(2);

      // when
      await certificationAssessmentRepository.save(certificationAssessmentToBeSaved);

      // then
      const persistedCertificationAssessment = await certificationAssessmentRepository.get(certificationAssessmentId);
      expect(persistedCertificationAssessment.certificationAnswersByDate[0].result).to.deep.equal(AnswerStatus.OK);
      expect(persistedCertificationAssessment.certificationAnswersByDate[1].result).to.deep.equal(AnswerStatus.SKIPPED);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('persists the mutation of assessment state', async function () {
      // given
      const dbf = databaseBuilder.factory;
      const userId = dbf.buildUser().id;
      const certificationCourseId = dbf.buildCertificationCourse({ userId }).id;
      const certificationAssessmentId = dbf.buildAssessment({
        userId,
        certificationCourseId,
        state: 'started',
      }).id;

      const certificationChallengeRecId = 'rec567';

      dbf.buildCertificationChallenge({
        challengeId: certificationChallengeRecId,
        courseId: certificationCourseId,
      });

      await databaseBuilder.commit();
      const certificationAssessmentToBeSaved = await certificationAssessmentRepository.get(certificationAssessmentId);
      certificationAssessmentToBeSaved.state = CertificationAssessment.states.ENDED_DUE_TO_FINALIZATION;

      // when
      await certificationAssessmentRepository.save(certificationAssessmentToBeSaved);

      // then
      const persistedCertificationAssessment = await certificationAssessmentRepository.get(certificationAssessmentId);
      expect(persistedCertificationAssessment.state).to.deep.equal(
        CertificationAssessment.states.ENDED_DUE_TO_FINALIZATION
      );
    });
  });
});
