// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoringCer... Remove this comment to see the full error message
const scoringCertificationService = require('../../../../../lib/domain/services/scoring/scoring-certification-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'states'.
const { states } = require('../../../../../lib/domain/models/CertificationAssessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../../../../../lib/domain/services/placement-profile-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
const UserCompetence = require('../../../../../lib/domain/models/UserCompetence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../../../../../lib/domain/errors');

function _buildUserCompetence(competence: $TSFixMe, pixScore: $TSFixMe, estimatedLevel: $TSFixMe) {
  return new UserCompetence({ ...competence, estimatedLevel, pixScore });
}

const pixForCompetence1 = 10;
const pixForCompetence2 = 20;
const pixForCompetence3 = 30;
const pixForCompetence4 = 40;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UNCERTIFIE... Remove this comment to see the full error message
const UNCERTIFIED_LEVEL = -1;

const correctAnswersForAllChallenges = () =>
  _.map(
    [
      { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_F_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_G_for_competence_3', result: 'ok' },
      { challengeId: 'challenge_H_for_competence_3', result: 'ok' },
      { challengeId: 'challenge_I_for_competence_3', result: 'ok' },
      { challengeId: 'challenge_J_for_competence_4', result: 'ok' },
      { challengeId: 'challenge_K_for_competence_4', result: 'ok' },
      { challengeId: 'challenge_L_for_competence_4', result: 'ok' },
    ],
    domainBuilder.buildAnswer
  );

const wrongAnswersForAllChallenges = () =>
  _.map(
    [
      { challengeId: 'challenge_A_for_competence_1', result: 'ko' },
      { challengeId: 'challenge_B_for_competence_1', result: 'ko' },
      { challengeId: 'challenge_C_for_competence_1', result: 'ko' },
      { challengeId: 'challenge_D_for_competence_2', result: 'ko' },
      { challengeId: 'challenge_E_for_competence_2', result: 'ko' },
      { challengeId: 'challenge_F_for_competence_2', result: 'ko' },
      { challengeId: 'challenge_G_for_competence_3', result: 'ko' },
      { challengeId: 'challenge_H_for_competence_3', result: 'ko' },
      { challengeId: 'challenge_I_for_competence_3', result: 'ko' },
      { challengeId: 'challenge_J_for_competence_4', result: 'ko' },
      { challengeId: 'challenge_K_for_competence_4', result: 'ko' },
      { challengeId: 'challenge_L_for_competence_4', result: 'ko' },
    ],
    domainBuilder.buildAnswer
  );

const answersToHaveOnlyTheLastCompetenceFailed = () =>
  _.map(
    [
      { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_F_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_G_for_competence_3', result: 'ok' },
      { challengeId: 'challenge_H_for_competence_3', result: 'ok' },
      { challengeId: 'challenge_I_for_competence_3', result: 'ok' },
      { challengeId: 'challenge_J_for_competence_4', result: 'ko' },
      { challengeId: 'challenge_K_for_competence_4', result: 'ko' },
      { challengeId: 'challenge_L_for_competence_4', result: 'ko' },
    ],
    domainBuilder.buildAnswer
  );

const answersWithReproducibilityRateLessThan80 = () =>
  _.map(
    [
      { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_B_for_competence_1', result: 'ko' },
      { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
      { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_F_for_competence_2', result: 'ok' },
      { challengeId: 'challenge_G_for_competence_3', result: 'ok' },
      { challengeId: 'challenge_H_for_competence_3', result: 'ko' },
      { challengeId: 'challenge_I_for_competence_3', result: 'ko' },
      { challengeId: 'challenge_J_for_competence_4', result: 'ok' },
      { challengeId: 'challenge_K_for_competence_4', result: 'ko' },
      { challengeId: 'challenge_L_for_competence_4', result: 'ok' },
    ],
    domainBuilder.buildAnswer
  );

const challenges = _.map(
  [
    {
      challengeId: 'challenge_A_for_competence_1',
      competenceId: 'competence_1',
      associatedSkillName: '@skillChallengeA_1',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_C_for_competence_1',
      competenceId: 'competence_1',
      associatedSkillName: '@skillChallengeC_1',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_B_for_competence_1',
      competenceId: 'competence_1',
      associatedSkillName: '@skillChallengeB_1',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_D_for_competence_2',
      competenceId: 'competence_2',
      associatedSkillName: '@skillChallengeD_2',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_E_for_competence_2',
      competenceId: 'competence_2',
      associatedSkillName: '@skillChallengeE_2',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_F_for_competence_2',
      competenceId: 'competence_2',
      associatedSkillName: '@skillChallengeF_2',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_G_for_competence_3',
      competenceId: 'competence_3',
      associatedSkillName: '@skillChallengeG_3',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_H_for_competence_3',
      competenceId: 'competence_3',
      associatedSkillName: '@skillChallengeH_3',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_I_for_competence_3',
      competenceId: 'competence_3',
      associatedSkillName: '@skillChallengeI_3',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_J_for_competence_4',
      competenceId: 'competence_4',
      associatedSkillName: '@skillChallengeJ_4',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_K_for_competence_4',
      competenceId: 'competence_4',
      associatedSkillName: '@skillChallengeK_4',
      type: 'QCM',
    },
    {
      challengeId: 'challenge_L_for_competence_4',
      competenceId: 'competence_4',
      associatedSkillName: '@skillChallengeL_4',
      type: 'QCM',
    },
  ],
  domainBuilder.buildCertificationChallengeWithType
);

const competence_1 = domainBuilder.buildCompetence({
  id: 'competence_1',
  index: '1.1',
  area: { code: '1' },
  name: 'Mener une recherche',
});
const competence_2 = domainBuilder.buildCompetence({
  id: 'competence_2',
  index: '2.2',
  area: { code: '2' },
  name: 'Partager',
});
const competence_3 = domainBuilder.buildCompetence({
  id: 'competence_3',
  index: '3.3',
  area: { code: '3' },
  name: 'Adapter',
});
const competence_4 = domainBuilder.buildCompetence({
  id: 'competence_4',
  index: '4.4',
  area: { code: '4' },
  name: 'Résoudre',
});
const competence_5 = domainBuilder.buildCompetence({
  id: 'competence_5',
  index: '5.5',
  area: { code: '5' },
  name: 'Chercher',
});
const competence_6 = domainBuilder.buildCompetence({
  id: 'competence_6',
  index: '6.6',
  area: { code: '6' },
  name: 'Trouver',
});

const userCompetences = [
  _buildUserCompetence(competence_1, pixForCompetence1, 1),
  _buildUserCompetence(competence_2, pixForCompetence2, 2),
  _buildUserCompetence(competence_3, pixForCompetence3, 3),
  _buildUserCompetence(competence_4, pixForCompetence4, 4),
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Certification Result Service', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#calculateCertificationAssessmentScore', function () {
    let certificationAssessment: $TSFixMe, certificationAssessmentData: $TSFixMe, expectedCertifiedCompetences: $TSFixMe;
    let competenceWithMarks_1_1: $TSFixMe, competenceWithMarks_2_2: $TSFixMe, competenceWithMarks_3_3: $TSFixMe, competenceWithMarks_4_4: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      certificationAssessmentData = {
        id: 1,
        userId: 11,
        certificationCourseId: 111,
        createdAt: '2020-02-01T00:00:00Z',
        completedAt: '2020-02-01T00:00:00Z',
        state: states.COMPLETED,
        isV2Certification: true,
      };
      competenceWithMarks_1_1 = domainBuilder.buildCompetenceMark({
        level: UNCERTIFIED_LEVEL,
        score: 0,
        area_code: '1',
        competence_code: '1.1',
        competenceId: 'competence_1',
      });
      competenceWithMarks_2_2 = domainBuilder.buildCompetenceMark({
        level: UNCERTIFIED_LEVEL,
        score: 0,
        area_code: '2',
        competence_code: '2.2',
        competenceId: 'competence_2',
      });
      competenceWithMarks_3_3 = domainBuilder.buildCompetenceMark({
        level: UNCERTIFIED_LEVEL,
        score: 0,
        area_code: '3',
        competence_code: '3.3',
        competenceId: 'competence_3',
      });
      competenceWithMarks_4_4 = domainBuilder.buildCompetenceMark({
        level: UNCERTIFIED_LEVEL,
        score: 0,
        area_code: '4',
        competence_code: '4.4',
        competenceId: 'competence_4',
      });
      expectedCertifiedCompetences = [
        competenceWithMarks_1_1,
        competenceWithMarks_2_2,
        competenceWithMarks_3_3,
        competenceWithMarks_4_4,
      ];
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When at least one challenge have more than one answer ', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const certificationAnswersByDate = _.map(
          [
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_F_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_G_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_H_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_I_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_J_for_competence_4', result: 'ok' },
            { challengeId: 'challenge_K_for_competence_4', result: 'ok' },
            { challengeId: 'challenge_K_for_competence_4', result: 'ok' },
            { challengeId: 'challenge_L_for_competence_4', result: 'ok' },
          ],
          domainBuilder.buildAnswer
        );

        const certificationAssessment = {
          certificationAnswersByDate,
          certificationChallenges: challenges,
        };

        sinon
    .stub(placementProfileService, 'getPlacementProfile')
    .withArgs({
    userId: (certificationAssessment as $TSFixMe).userId,
    limitDate: (certificationAssessment as $TSFixMe).createdAt,
    isV2Certification: (certificationAssessment as $TSFixMe).isV2Certification,
})
    .resolves({ userCompetences });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(scoringCertificationService.calculateCertificationAssessmentScore)({
          certificationAssessment,
          continueOnError: false,
        });

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal('Plusieurs réponses pour une même épreuve');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are less answers than challenges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const certificationAnswersByDate = _.map(
          [
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_F_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_G_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_H_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_I_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_J_for_competence_4', result: 'ok' },
            { challengeId: 'challenge_K_for_competence_4', result: 'ok' },
          ],
          domainBuilder.buildAnswer
        );

        const certificationAssessment = {
          certificationAnswersByDate,
          certificationChallenges: challenges,
        };

        sinon
    .stub(placementProfileService, 'getPlacementProfile')
    .withArgs({
    userId: (certificationAssessment as $TSFixMe).userId,
    limitDate: (certificationAssessment as $TSFixMe).createdAt,
    isV2Certification: (certificationAssessment as $TSFixMe).isV2Certification,
})
    .resolves({ userCompetences });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(scoringCertificationService.calculateCertificationAssessmentScore)({
          certificationAssessment,
          continueOnError: false,
        });

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal("L’utilisateur n’a pas répondu à toutes les questions, alors qu'aucune raison d'abandon n'a été fournie.");
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no challenge for a competence ', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const certificationAnswersByDate = _.map(
          [
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_F_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_G_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_H_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_I_for_competence_3', result: 'ok' },
            { challengeId: 'challenge_J_for_competence_4', result: 'ok' },
            { challengeId: 'challenge_K_for_competence_4', result: 'ok' },
          ],
          domainBuilder.buildAnswer
        );

        const challenges = _.map(
          [
            {
              challengeId: 'challenge_A_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeA_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_C_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeC_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_B_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeB_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_D_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeD_2',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_E_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeE_2',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_F_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeF_2',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_G_for_competence_3',
              competenceId: 'competence_3',
              associatedSkillName: '@skillChallengeG_3',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_H_for_competence_3',
              competenceId: 'competence_3',
              associatedSkillName: '@skillChallengeH_3',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_I_for_competence_3',
              competenceId: 'competence_3',
              associatedSkillName: '@skillChallengeI_3',
              type: 'QCM',
            },
          ],
          domainBuilder.buildCertificationChallengeWithType
        );

        const certificationAssessment = {
          certificationAnswersByDate,
          certificationChallenges: challenges,
        };

        sinon
    .stub(placementProfileService, 'getPlacementProfile')
    .withArgs({
    userId: (certificationAssessment as $TSFixMe).userId,
    limitDate: (certificationAssessment as $TSFixMe).createdAt,
    isV2Certification: (certificationAssessment as $TSFixMe).isV2Certification,
})
    .resolves({ userCompetences });

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(scoringCertificationService.calculateCertificationAssessmentScore)({
          certificationAssessment,
          continueOnError: false,
        });

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal('Pas assez de challenges posés pour la compétence 4.4');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Compute certification result for jury (continue on error)', function () {
      const continueOnError = true;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationAssessment = domainBuilder.buildCertificationAssessment({
          ...certificationAssessmentData,
          certificationAnswersByDate: wrongAnswersForAllChallenges(),
          certificationChallenges: challenges,
        });

        sinon
          .stub(placementProfileService, 'getPlacementProfile')
          .withArgs({
            userId: certificationAssessment.userId,
            limitDate: certificationAssessment.createdAt,
            isV2Certification: certificationAssessment.isV2Certification,
          })
          .resolves({ userCompetences });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should get user profile', async function () {
        // when
        await scoringCertificationService.calculateCertificationAssessmentScore({
          certificationAssessment,
          continueOnError,
        });

        // then
        sinon.assert.calledOnce(placementProfileService.getPlacementProfile);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when assessment is just started', function () {
        let startedCertificationAssessment: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          startedCertificationAssessment = domainBuilder.buildCertificationAssessment({
            ...certificationAssessment,
            completedAt: null,
            state: states.STARTED,
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with all certifiedLevel at -1', async function () {
          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment: startedCertificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when reproducibility rate is < 50%', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with all certifiedLevel at -1', async function () {
          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when reproducibility rate is between 80% and 100%', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          certificationAssessment.certificationAnswersByDate = correctAnswersForAllChallenges();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with all certifiedLevel equal to estimatedLevel', async function () {
          // given
          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_1_1,
              level: 1,
              score: pixForCompetence1,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_2_2,
              level: 2,
              score: pixForCompetence2,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_3_3,
              level: 3,
              score: pixForCompetence3,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_4_4,
              level: 4,
              score: pixForCompetence4,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with certifiedLevel = estimatedLevel except for failed competence', async function () {
          // given
          certificationAssessment.certificationAnswersByDate = answersToHaveOnlyTheLastCompetenceFailed();
          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_1_1,
              level: 1,
              score: pixForCompetence1,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_2_2,
              level: 2,
              score: pixForCompetence2,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_3_3,
              level: 3,
              score: pixForCompetence3,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_4_4,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when reproducibility rate is between 50% and 80%', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          certificationAssessment.certificationAnswersByDate = answersWithReproducibilityRateLessThan80();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with certifiedLevel less or equal to estimatedLevel', async function () {
          // given
          const malusForFalseAnswer = 8;
          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_1_1,
              level: 0,
              score: pixForCompetence1 - malusForFalseAnswer,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_2_2,
              level: 2,
              score: pixForCompetence2,
            }),
            competenceWithMarks_3_3,
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_4_4,
              level: 3,
              score: pixForCompetence4 - malusForFalseAnswer,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the percentage of correct answers', async function () {
          // given
          const certificationAssessmentWithNeutralizedChallenge = _.cloneDeep(certificationAssessment);
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[0].isNeutralized = true;

          // when
          const { percentageCorrectAnswers } = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment: certificationAssessmentWithNeutralizedChallenge,
            continueOnError,
          });

          // then
          expect(percentageCorrectAnswers).to.deep.equal(64);
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when one competence is evaluated with 3 challenges', function () {
          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('with one OK, one KO and one QROCM-dep OK', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should return level obtained equal to level positioned minus one', async function () {
              // Given
              const positionedLevel = 2;
              const positionedScore = 20;

              const answers = _.map(
                [
                  { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
                  { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
                  { challengeId: 'challenge_C_for_competence_1', result: 'ko' },
                ],
                domainBuilder.buildAnswer
              );

              const challenges = _.map(
                [
                  {
                    challengeId: 'challenge_A_for_competence_1',
                    competenceId: 'competence_1',
                    associatedSkillName: '@skillChallengeA_1',
                  },
                  {
                    challengeId: 'challenge_B_for_competence_1',
                    competenceId: 'competence_1',
                    associatedSkillName: '@skillChallengeB_1',
                  },
                  {
                    challengeId: 'challenge_C_for_competence_1',
                    competenceId: 'competence_1',
                    associatedSkillName: '@skillChallengeC_1',
                  },
                ],
                domainBuilder.buildCertificationChallengeWithType
              );

              const userCompetences = [_buildUserCompetence(competence_1, positionedScore, positionedLevel)];

              certificationAssessment.certificationAnswersByDate = answers;
              certificationAssessment.certificationChallenges = challenges;
              placementProfileService.getPlacementProfile.restore();
              sinon
                .stub(placementProfileService, 'getPlacementProfile')
                .withArgs({
                  userId: certificationAssessment.userId,
                  limitDate: certificationAssessment.createdAt,
                  isV2Certification: certificationAssessment.isV2Certification,
                })
                .resolves({ userCompetences });

              // When
              const certificationAssessmentScore =
                await scoringCertificationService.calculateCertificationAssessmentScore({
                  certificationAssessment,
                  continueOnError,
                });

              // Then
              expect(certificationAssessmentScore.competenceMarks[0].level).to.deep.equal(positionedLevel - 1);
              expect(certificationAssessmentScore.competenceMarks[0].score).to.deep.equal(positionedScore - 8);
            });
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Calculate certification result when assessment is completed (stop on error)', function () {
      const continueOnError = false;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationAssessment = domainBuilder.buildCertificationAssessment({
          ...certificationAssessmentData,
          certificationAnswersByDate: wrongAnswersForAllChallenges(),
          certificationChallenges: challenges,
        });
        sinon
          .stub(placementProfileService, 'getPlacementProfile')
          .withArgs({
            userId: certificationAssessment.userId,
            limitDate: certificationAssessment.createdAt,
            isV2Certification: certificationAssessment.isV2Certification,
          })
          .resolves({ userCompetences });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when reproducibility rate is < 50%', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with all certifiedLevel at -1', async function () {
          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when reproducibility rate is between 80% and 100%', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          certificationAssessment.certificationAnswersByDate = correctAnswersForAllChallenges();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with all certifiedLevel equal to estimatedLevel', async function () {
          // given
          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_1_1,
              level: 1,
              score: pixForCompetence1,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_2_2,
              level: 2,
              score: pixForCompetence2,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_3_3,
              level: 3,
              score: pixForCompetence3,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_4_4,
              level: 4,
              score: pixForCompetence4,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with certifiedLevel = estimatedLevel except for failed competence', async function () {
          // given
          certificationAssessment.certificationAnswersByDate = answersToHaveOnlyTheLastCompetenceFailed();
          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_1_1,
              level: 1,
              score: pixForCompetence1,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_2_2,
              level: 2,
              score: pixForCompetence2,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_3_3,
              level: 3,
              score: pixForCompetence3,
            }),
            competenceWithMarks_4_4,
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when reproducibility rate is between 50% and 80%', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          certificationAssessment.certificationAnswersByDate = answersWithReproducibilityRateLessThan80();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return list of competences with certifiedLevel less or equal to estimatedLevel', async function () {
          // given
          const malusForFalseAnswer = 8;
          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_1_1,
              level: 0,
              score: pixForCompetence1 - malusForFalseAnswer,
            }),
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_2_2,
              level: 2,
              score: pixForCompetence2,
            }),
            competenceWithMarks_3_3,
            domainBuilder.buildCompetenceMark({
              ...competenceWithMarks_4_4,
              level: 3,
              score: pixForCompetence4 - malusForFalseAnswer,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when only one challenge is asked for a competence', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('certifies a level below the estimated one if reproducibility rate is < 70%', async function () {
          // given
          const userCompetences = [
            _buildUserCompetence(competence_5, 50, 5),
            _buildUserCompetence(competence_6, 36, 3),
          ];
          certificationAssessment.certificationChallenges = _.map(
            [
              {
                challengeId: 'challenge_A_for_competence_5',
                competenceId: 'competence_5',
                associatedSkillName: '@skillChallengeA_5',
              },
              {
                challengeId: 'challenge_A_for_competence_6',
                competenceId: 'competence_6',
                associatedSkillName: '@skillChallengeA_6',
              },
              {
                challengeId: 'challenge_B_for_competence_6',
                competenceId: 'competence_6',
                associatedSkillName: '@skillChallengeB_6',
              },
              {
                challengeId: 'challenge_C_for_competence_6',
                competenceId: 'competence_6',
                associatedSkillName: '@skillChallengeC_6',
              },
            ],
            domainBuilder.buildCertificationChallengeWithType
          );

          placementProfileService.getPlacementProfile.restore();
          sinon
            .stub(placementProfileService, 'getPlacementProfile')
            .withArgs({
              userId: certificationAssessment.userId,
              limitDate: certificationAssessment.createdAt,
              isV2Certification: certificationAssessment.isV2Certification,
            })
            .resolves({ userCompetences });

          certificationAssessment.certificationAnswersByDate = _.map(
            [
              { challengeId: 'challenge_A_for_competence_5', result: 'ok' },
              { challengeId: 'challenge_A_for_competence_6', result: 'ko' },
              { challengeId: 'challenge_B_for_competence_6', result: 'ok' },
              { challengeId: 'challenge_C_for_competence_6', result: 'ko' },
            ],
            domainBuilder.buildAnswer
          );

          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              competence_code: '5.5',
              area_code: '5',
              competenceId: 'competence_5',
              level: 4,
              score: 40,
            }),
            domainBuilder.buildCompetenceMark({
              competence_code: '6.6',
              area_code: '6',
              competenceId: 'competence_6',
              level: UNCERTIFIED_LEVEL,
              score: 0,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when challenges contains one QROCM-dep challenge to validate two skills', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const userCompetences = [
            _buildUserCompetence(competence_5, 50, 5),
            _buildUserCompetence(competence_6, 36, 3),
          ];

          certificationAssessment.certificationChallenges = _.map(
            [
              {
                challengeId: 'challenge_A_for_competence_5',
                competenceId: 'competence_5',
                associatedSkillName: '@skillChallengeA_5',
                type: 'QCM',
              },
              {
                challengeId: 'challenge_B_for_competence_5',
                competenceId: 'competence_5',
                associatedSkillName: '@skillChallengeB_5',
                type: 'QROCM-dep',
              },
              {
                challengeId: 'challenge_A_for_competence_6',
                competenceId: 'competence_6',
                associatedSkillName: '@skillChallengeA_6',
                type: 'QCM',
              },
              {
                challengeId: 'challenge_B_for_competence_6',
                competenceId: 'competence_6',
                associatedSkillName: '@skillChallengeB_6',
                type: 'QCM',
              },
              {
                challengeId: 'challenge_C_for_competence_6',
                competenceId: 'competence_6',
                associatedSkillName: '@skillChallengeC_6',
                type: 'QCM',
              },
            ],
            domainBuilder.buildCertificationChallengeWithType
          );

          placementProfileService.getPlacementProfile.restore();
          sinon
            .stub(placementProfileService, 'getPlacementProfile')
            .withArgs({
              userId: certificationAssessment.userId,
              limitDate: certificationAssessment.createdAt,
              isV2Certification: certificationAssessment.isV2Certification,
            })
            .resolves({ userCompetences });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should compute the result as if QROCM-dep was two OK challenges', async function () {
          // given
          certificationAssessment.certificationAnswersByDate = _.map(
            [
              { challengeId: 'challenge_A_for_competence_5', result: 'ok' },
              { challengeId: 'challenge_B_for_competence_5', result: 'ok' },
              { challengeId: 'challenge_A_for_competence_6', result: 'ko' },
              { challengeId: 'challenge_B_for_competence_6', result: 'ok' },
              { challengeId: 'challenge_C_for_competence_6', result: 'ko' },
            ],
            domainBuilder.buildAnswer
          );

          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              competence_code: '5.5',
              area_code: '5',
              competenceId: 'competence_5',
              level: 5,
              score: 40,
            }),
            domainBuilder.buildCompetenceMark({
              competence_code: '6.6',
              area_code: '6',
              competenceId: 'competence_6',
              level: UNCERTIFIED_LEVEL,
              score: 0,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should compute the result of QROCM-dep as only one OK because result is partially right', async function () {
          // given
          certificationAssessment.certificationAnswersByDate = _.map(
            [
              { challengeId: 'challenge_A_for_competence_5', result: 'ok' },
              { challengeId: 'challenge_B_for_competence_5', result: 'partially' },
              { challengeId: 'challenge_A_for_competence_6', result: 'ko' },
              { challengeId: 'challenge_B_for_competence_6', result: 'ok' },
              { challengeId: 'challenge_C_for_competence_6', result: 'ok' },
            ],
            domainBuilder.buildAnswer
          );

          const expectedCertifiedCompetences = [
            domainBuilder.buildCompetenceMark({
              competence_code: '5.5',
              area_code: '5',
              competenceId: 'competence_5',
              level: 4,
              score: 40,
            }),
            domainBuilder.buildCompetenceMark({
              competence_code: '6.6',
              area_code: '6',
              competenceId: 'competence_6',
              level: 2,
              score: 28,
            }),
          ];

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.competenceMarks).to.deep.equal(expectedCertifiedCompetences);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are challenges for non-certifiable competences', function () {
        let challenges;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          challenges = _.map(
            [
              {
                challengeId: 'challenge_A_for_competence_1',
                competenceId: 'competence_1',
                associatedSkillName: '@skillChallengeA_1',
              },
              {
                challengeId: 'challenge_M_for_competence_5',
                competenceId: 'competence_5',
                associatedSkillName: '@skillChallengeM_5',
              },
              {
                challengeId: 'challenge_N_for_competence_6',
                competenceId: 'competence_6',
                associatedSkillName: '@skillChallengeN_6',
              },
            ],
            domainBuilder.buildCertificationChallengeWithType
          );
          certificationAssessment.certificationChallenges = challenges;

          certificationAssessment.certificationAnswersByDate = _.map(
            [
              { challengeId: 'challenge_A_for_competence_1', result: 'ko' },

              { challengeId: 'challenge_M_for_competence_5', result: 'ok' },
              { challengeId: 'challenge_N_for_competence_6', result: 'ok' },
            ],
            domainBuilder.buildAnswer
          );
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not include the extra challenges when computing reproducibility', async function () {
          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment,
            continueOnError,
          });

          // then
          expect(certificationAssessmentScore.percentageCorrectAnswers).to.equal(0);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('non neutralization rate trustability', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationAssessment = domainBuilder.buildCertificationAssessment({
          ...certificationAssessmentData,
          certificationAnswersByDate: wrongAnswersForAllChallenges(),
          certificationChallenges: challenges,
        });
        certificationAssessment.certificationAnswersByDate = correctAnswersForAllChallenges();
        sinon
          .stub(placementProfileService, 'getPlacementProfile')
          .withArgs({
            userId: certificationAssessment.userId,
            limitDate: certificationAssessment.createdAt,
            isV2Certification: certificationAssessment.isV2Certification,
          })
          .resolves({ userCompetences });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when certification has enough non neutralized challenges to be trusted', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a CertificationAssessmentScore which hasEnoughNonNeutralizedChallengesToBeTrusted is true', async function () {
          // given
          const certificationAssessmentWithNeutralizedChallenge = _.cloneDeep(certificationAssessment);
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[0].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[1].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[2].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[3].isNeutralized = true;

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment: certificationAssessmentWithNeutralizedChallenge,
            continueOnError: false,
          });

          // then
          expect(certificationAssessmentScore.hasEnoughNonNeutralizedChallengesToBeTrusted).to.be.true;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when certification has not enough non neutralized challenges to be trusted', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a CertificationAssessmentScore which hasEnoughNonNeutralizedChallengesToBeTrusted is false', async function () {
          // given
          const certificationAssessmentWithNeutralizedChallenge = _.cloneDeep(certificationAssessment);
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[0].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[1].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[2].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[3].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[4].isNeutralized = true;
          certificationAssessmentWithNeutralizedChallenge.certificationChallenges[5].isNeutralized = true;

          // when
          const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
            certificationAssessment: certificationAssessmentWithNeutralizedChallenge,
            continueOnError: false,
          });

          // then
          expect(certificationAssessmentScore.hasEnoughNonNeutralizedChallengesToBeTrusted).to.be.false;
        });
      });
    });
  });
});
