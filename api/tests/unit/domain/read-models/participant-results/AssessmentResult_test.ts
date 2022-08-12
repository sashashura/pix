// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../../../../lib/domain/constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../../lib/domain/read-models/participant-results/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../../lib/domain/models/KnowledgeElement');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | ParticipantResult | AssessmentResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('computes the number of skills, the number of skill tested and the number of skill validated', function () {
    const competences = [
      {
        id: 'rec1',
        name: 'C1',
        index: '1.1',
        areaName: 'Domaine1',
        areaColor: 'Couleur1',
        skillIds: ['skill1', 'skill2'],
      },
      {
        id: 'rec2',
        name: 'C2',
        index: '2.1',
        areaName: 'Domaine2',
        areaColor: 'Couleur2',
        skillIds: ['skill3', 'skill4'],
      },
    ];

    const knowledgeElements = [
      domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill4', status: KnowledgeElement.StatusType.VALIDATED }),
    ];
    const participationResults = {
      campaignParticipationId: 12,
      isCompleted: true,
      knowledgeElements,
      acquiredBadgeIds: [],
      sharedAt: new Date(),
      participantExternalId: 'greg@lafleche.fr',
    };

    const targetProfile = { competences, stages: [], badges: [] };

    const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

    expect(assessmentResult).to.deep.include({
      id: 12,
      totalSkillsCount: 4,
      testedSkillsCount: 3,
      validatedSkillsCount: 2,
      isCompleted: true,
      isShared: true,
      participantExternalId: 'greg@lafleche.fr',
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('masteryPercentage computation', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is not shared', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are assessed competences', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('computes the mastery rate using knowledge elements', function () {
          const competences = [
            {
              id: 'rec1',
              name: 'C1',
              index: '1.1',
              areaName: 'Domaine1',
              areaColor: 'Couleur1',
              skillIds: ['skill1', 'skill2', 'skill3'],
            },
            {
              id: 'rec2',
              name: 'C2',
              index: '2.1',
              areaName: 'Domaine2',
              areaColor: 'Couleur2',
              skillIds: ['skill4', 'skill5', 'skill6'],
            },
          ];

          const knowledgeElements = [
            domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill3', status: KnowledgeElement.StatusType.VALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill4', status: KnowledgeElement.StatusType.VALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill5', status: KnowledgeElement.StatusType.VALIDATED }),
          ];
          const participationResults = {
            campaignParticipationId: 12,
            isCompleted: true,
            knowledgeElements,
            acquiredBadgeIds: [],
            sharedAt: null,
          };

          const targetProfile = { competences, stages: [], badges: [] };

          const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

          expect(assessmentResult.masteryRate).to.equal(0.67);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is no assessed competences', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns 0', function () {
          const competences: $TSFixMe = [];

          const knowledgeElements = [
            domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill3', status: KnowledgeElement.StatusType.VALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill4', status: KnowledgeElement.StatusType.VALIDATED }),
            domainBuilder.buildKnowledgeElement({ skillId: 'skill5', status: KnowledgeElement.StatusType.VALIDATED }),
          ];
          const participationResults = {
            campaignParticipationId: 12,
            isCompleted: true,
            knowledgeElements,
            acquiredBadgeIds: [],
            sharedAt: null,
          };

          const targetProfile = { competences, stages: [], badges: [] };

          const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

          expect(assessmentResult.masteryRate).to.equal(0);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the mastery rate of the participation', function () {
        const competences = [
          {
            id: 'rec1',
            name: 'C1',
            index: '1.1',
            areaName: 'Domaine1',
            areaColor: 'Couleur1',
            skillIds: ['skill1', 'skill2', 'skill2'],
          },
        ];

        const participationResults = {
          campaignParticipationId: 12,
          isCompleted: true,
          knowledgeElements: [],
          acquiredBadgeIds: [],
          sharedAt: new Date('2021-09-25'),
          masteryRate: 0.5,
        };

        const targetProfile = { competences, stages: [], badges: [] };

        const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

        expect(assessmentResult.masteryRate).to.equal(0.5);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('computes the result by competences', function () {
    const competences = [
      {
        id: 'rec1',
        name: 'C1',
        index: '1.1',
        areaName: 'Domaine1',
        areaColor: 'Couleur1',
        skillIds: ['skill1', 'skill2', 'skill3'],
      },
      { id: 'rec2', name: 'C2', index: '2.1', areaName: 'Domaine2', areaColor: 'Couleur2', skillIds: ['skill4'] },
    ];

    const knowledgeElements = [
      domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill4', status: KnowledgeElement.StatusType.VALIDATED }),
    ];

    const participationResults = { knowledgeElements, acquiredBadgeIds: [] };

    const targetProfile = { competences, stages: [], badges: [] };

    const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

    const competenceResults1 = assessmentResult.competenceResults.find(({
      id
    }: $TSFixMe) => competences[0].id === id);
    const competenceResults2 = assessmentResult.competenceResults.find(({
      id
    }: $TSFixMe) => competences[1].id === id);

    expect(competenceResults1).to.deep.include({ name: 'C1', masteryPercentage: 33 });
    expect(competenceResults2).to.deep.include({ name: 'C2', masteryPercentage: 100 });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the targetProfile has stages', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('gives the reached stage', function () {
      const competences = [
        {
          id: 'rec1',
          name: 'C1',
          index: '1.1',
          areaName: 'Domaine1',
          areaColor: 'Couleur1',
          skillIds: ['skill1', 'skill2', 'skill3'],
        },
      ];

      const knowledgeElements = [
        domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
        domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
        domainBuilder.buildKnowledgeElement({ skillId: 'skill3', status: KnowledgeElement.StatusType.VALIDATED }),
      ];
      const participationResults = { knowledgeElements, acquiredBadgeIds: [], masteryRate: '0.65' };

      const stages = [
        { id: 1, title: 'Stage1', message: 'message1', threshold: 25 },
        { id: 2, title: 'Stage2', message: 'message2', threshold: 60 },
        { id: 3, title: 'Stage3', message: 'message3', threshold: 90 },
      ];

      const targetProfile = { competences, stages, badges: [] };

      const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

      expect(assessmentResult.reachedStage).to.deep.include({ id: 2, title: 'Stage2', starCount: 2 });
      expect(assessmentResult.stageCount).to.equal(3);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the targetProfile has badges', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('computes results for each badge', function () {
      const competences = [
        {
          id: 'rec1',
          name: 'C1',
          index: '1.1',
          areaName: 'Domaine1',
          areaColor: 'Couleur1',
          skillIds: ['skill1', 'skill2', 'skill3'],
        },
      ];
      const participationResults = { knowledgeElements: [], acquiredBadgeIds: [1] };

      const badges = [
        {
          id: 2,
          title: 'Badge Blue',
          message: 'Badge Blue Message',
          altMessage: 'Badge Blue Alt Message',
          key: 'Blue',
          imageUrl: 'blue.svg',
          badgeCompetences: [],
        },
        {
          id: 1,
          title: 'Badge Yellow',
          message: 'Yellow Message',
          altMessage: 'Yellow Alt Message',
          key: 'YELLOW',
          imageUrl: 'yellow.svg',
          badgeCompetences: [],
        },
      ];

      const targetProfile = { competences, stages: [], badges };

      const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);
      const badgeResult1 = assessmentResult.badgeResults.find(({
        id
      }: $TSFixMe) => id === 1);
      const badgeResult2 = assessmentResult.badgeResults.find(({
        id
      }: $TSFixMe) => id === 2);
      expect(badgeResult1).to.deep.include({ title: 'Badge Yellow', isAcquired: true });
      expect(badgeResult2).to.deep.include({ title: 'Badge Blue', isAcquired: false });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#canRetry', function () {
    let clock: $TSFixMe, originalConstantValue: $TSFixMe, now;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      originalConstantValue = constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING;
      now = new Date('2020-01-05T05:06:07Z');
      clock = sinon.useFakeTimers(now);
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING = 4;
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING = originalConstantValue;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign does not allow multiple sendings', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const isCampaignMultipleSendings = false;
        const isOrganizationLearnerActive = true;
        const isCampaignArchived = false;
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          masteryRate: '0.34',
          sharedAt: new Date('2020-01-01T05:06:07Z'),
          isDeleted: false,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(
          participationResults,
          targetProfile,
          isCampaignMultipleSendings,
          isOrganizationLearnerActive,
          isCampaignArchived
        );

        expect(assessmentResult.canRetry).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participant is disabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const isCampaignMultipleSendings = true;
        const isOrganizationLearnerActive = false;
        const isCampaignArchived = false;
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          masteryRate: '0.34',
          sharedAt: new Date('2020-01-01T05:06:07Z'),
          isDeleted: false,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(
          participationResults,
          targetProfile,
          isCampaignMultipleSendings,
          isOrganizationLearnerActive,
          isCampaignArchived
        );

        expect(assessmentResult.canRetry).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is not shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const isCampaignMultipleSendings = true;
        const isOrganizationLearnerActive = true;
        const isCampaignArchived = false;
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          masteryRate: '0.34',
          sharedAt: null,
          isDeleted: false,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(
          participationResults,
          targetProfile,
          isCampaignMultipleSendings,
          isOrganizationLearnerActive,
          isCampaignArchived
        );

        expect(assessmentResult.canRetry).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is deleted', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const isCampaignMultipleSendings = true;
        const isOrganizationLearnerActive = true;
        const isCampaignArchived = false;
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          masteryRate: '0.34',
          sharedAt: new Date('2020-01-01T05:06:07Z'),
          isDeleted: true,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(
          participationResults,
          targetProfile,
          isCampaignMultipleSendings,
          isOrganizationLearnerActive,
          isCampaignArchived
        );

        expect(assessmentResult.canRetry).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign is archived', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const isCampaignMultipleSendings = true;
        const isOrganizationLearnerActive = true;
        const isCampaignArchived = true;
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          masteryRate: '0.34',
          sharedAt: new Date('2020-01-01T05:06:07Z'),
          isDeleted: false,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(
          participationResults,
          targetProfile,
          isCampaignMultipleSendings,
          isOrganizationLearnerActive,
          isCampaignArchived
        );

        expect(assessmentResult.canRetry).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the participation has been shared less than MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING days ago',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns false', function () {
          const isCampaignMultipleSendings = true;
          const isOrganizationLearnerActive = true;
          const isCampaignArchived = false;
          const participationResults = {
            knowledgeElements: [],
            acquiredBadgeIds: [],
            masteryRate: '0.34',
            sharedAt: new Date('2020-01-03T05:06:07Z'),
            isDeleted: false,
          };
          const targetProfile = { competences: [], stages: [], badges: [] };
          const assessmentResult = new AssessmentResult(
            participationResults,
            targetProfile,
            isCampaignMultipleSendings,
            isOrganizationLearnerActive,
            isCampaignArchived
          );

          expect(assessmentResult.canRetry).to.be.false;
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the mastery rate equals to 1', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const isCampaignMultipleSendings = true;
        const isOrganizationLearnerActive = true;
        const isCampaignArchived = false;
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          masteryRate: '1',
          sharedAt: new Date('2020-01-01T05:06:07Z'),
          isDeleted: false,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };

        const assessmentResult = new AssessmentResult(
          participationResults,
          targetProfile,
          isCampaignMultipleSendings,
          isOrganizationLearnerActive,
          isCampaignArchived
        );

        expect(assessmentResult.canRetry).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the campaign allow multiple sendings, the mastery rate is under 1.0, the participant is active and the participation has been shared more than MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING days ago',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns true', function () {
          const isCampaignMultipleSendings = true;
          const isOrganizationLearnerActive = true;
          const isCampaignArchived = false;
          const participationResults = {
            knowledgeElements: [],
            acquiredBadgeIds: [],
            masteryRate: '0.45',
            sharedAt: new Date('2019-12-12'),
            isDeleted: false,
          };
          const targetProfile = { competences: [], stages: [], badges: [] };
          const assessmentResult = new AssessmentResult(
            participationResults,
            targetProfile,
            isCampaignMultipleSendings,
            isOrganizationLearnerActive,
            isCampaignArchived
          );

          expect(assessmentResult.canRetry).to.be.true;
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the campaign allow multiple sendings, the mastery rate is under 1, the participant is active and the participation has been shared exactly MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING days ago',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns true', function () {
          const isCampaignMultipleSendings = true;
          const isOrganizationLearnerActive = true;
          const isCampaignArchived = false;
          const participationResults = {
            knowledgeElements: [],
            acquiredBadgeIds: [],
            masteryRate: '0.34',
            sharedAt: new Date('2020-01-01T05:06:07Z'),
            isDeleted: false,
          };
          const targetProfile = { competences: [], stages: [], badges: [] };
          const assessmentResult = new AssessmentResult(
            participationResults,
            targetProfile,
            isCampaignMultipleSendings,
            isOrganizationLearnerActive,
            isCampaignArchived
          );

          expect(assessmentResult.canRetry).to.be.true;
        });
      }
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#canImprove', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const originalConstantValue = constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING;
    const assessmentCreatedAt = new Date('2020-01-05T05:06:07Z');
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'before'.
    before(function () {
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING = 4;
    });

    // @ts-expect-error TS(2304): Cannot find name 'after'.
    after(function () {
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING = originalConstantValue;
    });

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(assessmentCreatedAt);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the knowledge element has been created less than MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING days before assessment was created',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns false', function () {
          const ke = domainBuilder.buildKnowledgeElement({
            status: KnowledgeElement.StatusType.INVALIDATED,
            createdAt: new Date('2020-01-03'),
          });
          const participationResults = {
            knowledgeElements: [ke],
            acquiredBadgeIds: [],
            assessmentCreatedAt,
          };
          const targetProfile = { competences: [], stages: [], badges: [] };

          const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

          expect(assessmentResult.canImprove).to.be.false;
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the knowledge element is validated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const ke = domainBuilder.buildKnowledgeElement({
          status: KnowledgeElement.StatusType.VALIDATED,
          createdAt: new Date('2020-01-01'),
        });
        const participationResults = {
          knowledgeElements: [ke],
          acquiredBadgeIds: [],
          assessmentCreatedAt,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };

        const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

        expect(assessmentResult.canImprove).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participation is shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const ke = domainBuilder.buildKnowledgeElement({
          status: KnowledgeElement.StatusType.INVALIDATED,
          createdAt: new Date('2020-01-01'),
        });
        const participationResults = {
          knowledgeElements: [ke],
          acquiredBadgeIds: [],
          assessmentCreatedAt,
          sharedAt: new Date(),
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

        expect(assessmentResult.canImprove).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when participation is not shared and the knowledge element is invalidated and created more than MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING days before assessment was created',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns true', function () {
          const ke = domainBuilder.buildKnowledgeElement({
            status: KnowledgeElement.StatusType.INVALIDATED,
            createdAt: new Date('2020-01-01'),
          });
          const participationResults = {
            knowledgeElements: [ke],
            acquiredBadgeIds: [],
            assessmentCreatedAt,
            sharedAt: null,
          };
          const targetProfile = { competences: [], stages: [], badges: [] };
          const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false);

          expect(assessmentResult.canImprove).to.be.true;
        });
      }
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isDisabled', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participation is deleted', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', function () {
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          isDeleted: true,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false, false);

        expect(assessmentResult.isDisabled).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign is archived', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', function () {
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          isDeleted: false,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false, true);

        expect(assessmentResult.isDisabled).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign is not archived and participation is not deleted', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const participationResults = {
          knowledgeElements: [],
          acquiredBadgeIds: [],
          isDeleted: false,
        };
        const targetProfile = { competences: [], stages: [], badges: [] };
        const assessmentResult = new AssessmentResult(participationResults, targetProfile, false, false, false);

        expect(assessmentResult.isDisabled).to.be.false;
      });
    });
  });
});
