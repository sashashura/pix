// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCertificationDetails = require('../../../../lib/domain/usecases/get-certification-details');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationDetails = require('../../../../lib/domain/read-models/CertificationDetails');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CertificationAssessmentStates = require('../../../../lib/domain/models/CertificationAssessment').states;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-certification-details', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('the certification assessment has not been completed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should compute the certification details on the fly', async function () {
      // given
      const certificationAssessmentRepository = {
        getByCertificationCourseId: sinon.stub(),
      };

      const placementProfileService = {
        getPlacementProfile: sinon.stub(),
      };

      const competenceMarkRepository = {
        findByCertificationCourseId: sinon.stub(),
      };

      const scoringCertificationService = {
        calculateCertificationAssessmentScore: sinon.stub(),
      };

      const certificationCourseId = 1234;
      const certificationChallenge = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'rec123',
        competenceId: 'recComp1',
        associatedSkillName: 'manger une mangue',
        isNeutralized: false,
      });
      const answer = domainBuilder.buildAnswer.ok({ challengeId: 'rec123', value: 'prout' });

      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId,
        certificationChallenges: [certificationChallenge],
        certificationAnswersByDate: [answer],
        state: CertificationAssessmentStates.STARTED,
      });

      certificationAssessmentRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId })
        .resolves(certificationAssessment);

      const competenceMark = domainBuilder.buildCompetenceMark({
        competenceId: 'recComp1',
        areaCode: '1',
        index: '1.1',
        name: 'Manger des fruits',
        level: 1,
        score: 5,
      });
      const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
        competenceMarks: [competenceMark],
        percentageCorrectAnswers: 100,
      });
      const placementProfile = domainBuilder.buildPlacementProfile.buildForCompetences({
        competencesData: [{ id: 'recComp1', index: '1.1', name: 'Manger des fruits', level: 3, score: 45 }],
      });

      competenceMarkRepository.findByCertificationCourseId.resolves([]);
      scoringCertificationService.calculateCertificationAssessmentScore
        .withArgs({ certificationAssessment, continueOnError: true })
        .resolves(certificationAssessmentScore);

      placementProfileService.getPlacementProfile
        .withArgs({
          userId: certificationAssessment.userId,
          limitDate: certificationAssessment.createdAt,
          isV2Certification: certificationAssessment.isV2Certification,
        })
        .resolves(placementProfile);

      // when
      const result = await getCertificationDetails({
        certificationCourseId,
        placementProfileService,
        competenceMarkRepository,
        certificationAssessmentRepository,
        scoringCertificationService,
      });

      //then
      expect(result).to.be.an.instanceof(CertificationDetails);
      expect(result).to.deep.equal({
        competencesWithMark: [
          {
            areaCode: '1',
            id: 'recComp1',
            index: '1.1',
            name: 'Manger des fruits',
            obtainedLevel: 1,
            obtainedScore: 5,
            positionedLevel: 3,
            positionedScore: 45,
          },
        ],
        createdAt: certificationAssessment.createdAt,
        completedAt: certificationAssessment.completedAt,
        id: certificationAssessment.certificationCourseId,
        listChallengesAndAnswers: [
          {
            challengeId: 'rec123',
            competence: '1.1',
            hasBeenSkippedAutomatically: false,
            isNeutralized: false,
            result: 'ok',
            skill: 'manger une mangue',
            value: 'prout',
          },
        ],
        percentageCorrectAnswers: 100,
        status: 'started',
        totalScore: 5,
        userId: 123,
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('the certification assessment has been completed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the certification details', async function () {
      // given
      const certificationAssessmentRepository = {
        getByCertificationCourseId: sinon.stub(),
      };

      const placementProfileService = {
        getPlacementProfile: sinon.stub(),
      };

      const competenceMarkRepository = {
        findByCertificationCourseId: sinon.stub(),
      };

      const scoringCertificationService = {
        calculateCertificationAssessmentScore: sinon.stub(),
      };

      const certificationCourseId = 1234;
      const certificationChallenge = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'rec123',
        competenceId: 'recComp1',
        associatedSkillName: 'manger une mangue',
        isNeutralized: false,
      });
      const answer = domainBuilder.buildAnswer.ok({ challengeId: 'rec123', value: 'prout' });

      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId,
        certificationChallenges: [certificationChallenge],
        certificationAnswersByDate: [answer],
        state: CertificationAssessmentStates.COMPLETED,
      });

      const competenceMark = domainBuilder.buildCompetenceMark({
        competenceId: 'recComp1',
        score: 5,
        level: 1,
        competence_code: '1.1',
        area_code: '1',
      });
      const competenceMarks = [competenceMark];
      const placementProfile = domainBuilder.buildPlacementProfile.buildForCompetences({
        competencesData: [{ id: 'recComp1', index: '1.1', name: 'Manger des fruits', level: 3, score: 45 }],
      });

      certificationAssessmentRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId })
        .resolves(certificationAssessment);

      placementProfileService.getPlacementProfile
        .withArgs({
          userId: certificationAssessment.userId,
          limitDate: certificationAssessment.createdAt,
          isV2Certification: certificationAssessment.isV2Certification,
        })
        .resolves(placementProfile);

      competenceMarkRepository.findByCertificationCourseId.withArgs(certificationCourseId).resolves(competenceMarks);

      // when
      const result = await getCertificationDetails({
        certificationCourseId,
        placementProfileService,
        competenceMarkRepository,
        certificationAssessmentRepository,
        scoringCertificationService,
      });

      //then
      expect(result).to.be.an.instanceof(CertificationDetails);
      expect(result).to.deep.equal({
        competencesWithMark: [
          {
            areaCode: '1',
            id: 'recComp1',
            index: '1.1',
            name: 'Manger des fruits',
            obtainedLevel: 1,
            obtainedScore: 5,
            positionedLevel: 3,
            positionedScore: 45,
          },
        ],
        createdAt: certificationAssessment.createdAt,
        completedAt: certificationAssessment.completedAt,
        id: certificationAssessment.certificationCourseId,
        listChallengesAndAnswers: [
          {
            challengeId: 'rec123',
            competence: '1.1',
            hasBeenSkippedAutomatically: false,
            isNeutralized: false,
            result: 'ok',
            skill: 'manger une mangue',
            value: 'prout',
          },
        ],
        percentageCorrectAnswers: 100,
        status: 'completed',
        totalScore: 5,
        userId: 123,
      });
    });
  });
});
