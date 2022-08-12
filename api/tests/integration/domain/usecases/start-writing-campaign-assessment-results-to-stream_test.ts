// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PassThroug... Remove this comment to see the full error message
const { PassThrough } = require('stream');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
  domainBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'streamToPr... Remove this comment to see the full error message
  streamToPromise,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'startWriti... Remove this comment to see the full error message
const startWritingCampaignAssessmentResultsToStream = require('../../../../lib/domain/usecases/start-writing-campaign-assessment-results-to-stream');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationInfoRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-info-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileWithLearningContentRepository = require('../../../../lib/infrastructure/repositories/target-profile-with-learning-content-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../../../lib/infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCs... Remove this comment to see the full error message
const campaignCsvExportService = require('../../../../lib/domain/services/campaign-csv-export-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Domain | Use Cases | start-writing-campaign-assessment-results-to-stream', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#startWritingCampaignAssessmentResultsToStream', function () {
    let organization: $TSFixMe;
    let targetProfile: $TSFixMe;
    let user: $TSFixMe;
    let participant;
    let campaign: $TSFixMe;
    let campaignParticipation: $TSFixMe;
    let organizationLearner: $TSFixMe;
    let writableStream: $TSFixMe;
    let csvPromise: $TSFixMe;
    let i18n: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      i18n = getI18n();
      organization = databaseBuilder.factory.buildOrganization({ showSkills: true });
      user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildMembership({ userId: user.id, organizationId: organization.id });
      const skillWeb1 = domainBuilder.buildTargetedSkill({ id: 'recSkillWeb1', name: '@web1', tubeId: 'recTube1' });
      const skillWeb2 = domainBuilder.buildTargetedSkill({ id: 'recSkillWeb2', name: '@web2', tubeId: 'recTube1' });
      const skillWeb3 = domainBuilder.buildTargetedSkill({ id: 'recSkillWeb3', name: '@web3', tubeId: 'recTube1' });
      const tube1 = domainBuilder.buildTargetedTube({
        id: 'recTube1',
        skills: [skillWeb1, skillWeb2, skillWeb3],
        competenceId: 'recCompetence1',
      });
      const competence1 = domainBuilder.buildTargetedCompetence({
        id: 'recCompetence1',
        index: '1.1',
        tubes: [tube1],
        areaId: 'recArea1',
      });
      domainBuilder.buildTargetedArea({ id: 'recArea1', competences: [competence1] });

      participant = databaseBuilder.factory.buildUser();
      const createdAt = new Date('2019-02-25T10:00:00Z');
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        skillId: skillWeb1.id,
        competenceId: competence1.id,
        userId: participant.id,
        createdAt,
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        skillId: skillWeb2.id,
        competenceId: competence1.id,
        userId: participant.id,
        createdAt,
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'invalidated',
        skillId: skillWeb3.id,
        competenceId: competence1.id,
        userId: participant.id,
        createdAt,
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        skillId: skillWeb3.id,
        competenceId: competence1.id,
        userId: participant.id,
        createdAt: new Date('2019-03-25T10:00:00Z'),
      });

      targetProfile = databaseBuilder.factory.buildTargetProfile({ name: '+Profile 1' });
      [skillWeb1, skillWeb2, skillWeb3].forEach((skill) => {
        databaseBuilder.factory.buildTargetProfileSkill({
          targetProfileId: targetProfile.id,
          skillId: skill.id,
        });
      });

      campaign = databaseBuilder.factory.buildCampaign({
        name: '@Campagne de Test N°1',
        code: 'AZERTY123',
        organizationId: organization.id,
        idPixLabel: 'Mail Pro',
        type: 'ASSESSMENT',
        targetProfileId: targetProfile.id,
      });

      organizationLearner = { firstName: '@Jean', lastName: '=Bono' };
      campaignParticipation = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
        organizationLearner,
        {
          createdAt,
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          participantExternalId: '+Mon mail pro',
          campaignId: campaign.id,
          userId: participant.id,
          masteryRate: 0.67,
        }
      );
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId: campaignParticipation.id,
        userId: participant.id,
        state: Assessment.states.COMPLETED,
        type: Assessment.types.CAMPAIGN,
      });
      databaseBuilder.factory.buildStage({ targetProfileId: targetProfile.id, threshold: 1 });
      databaseBuilder.factory.buildBadge({ targetProfileId: targetProfile.id });
      await databaseBuilder.commit();

      const learningContent = {
        areas: [{ id: 'recArea1', competenceIds: ['recCompetence1'] }],
        competences: [
          {
            id: 'recCompetence1',
            index: '1.1',
            skillIds: ['recSkillWeb1', 'recSkillWeb2', 'recSkillWeb3'],
            areaId: 'recArea1',
            origin: 'Pix',
          },
        ],
        thematics: [],
        tubes: [{ id: 'recTube1', competenceId: 'recCompetence1' }],
        skills: [
          { id: 'recSkillWeb1', name: '@web1', tubeId: 'recTube1', status: 'actif', competenceId: 'recCompetence1' },
          { id: 'recSkillWeb2', name: '@web2', tubeId: 'recTube1', status: 'actif', competenceId: 'recCompetence1' },
          { id: 'recSkillWeb3', name: '@web3', tubeId: 'recTube1', status: 'actif', competenceId: 'recCompetence1' },
        ],
        challenges: [],
      };

      mockLearningContent(learningContent);

      writableStream = new PassThrough();
      csvPromise = streamToPromise(writableStream);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the complete line', async function () {
      // given
      const expectedCsvFirstCell = '\uFEFF"Nom de l\'organisation"';
      const csvSecondLine =
        `"${organization.name}";` +
        `${campaign.id};` +
        `"'${campaign.name}";` +
        `"'${targetProfile.name}";` +
        `"'${organizationLearner.lastName}";` +
        `"'${organizationLearner.firstName}";` +
        `"'${campaignParticipation.participantExternalId}";` +
        '1;' +
        '2019-02-25;' +
        '"Oui";' +
        '2019-03-01;' +
        '1;' +
        '"Non";' +
        '0,67;' +
        '0,67;' +
        '3;' +
        '2;' +
        '0,67;' +
        '3;' +
        '2;' +
        '"OK";' +
        '"OK";' +
        '"KO"';

      // when
      startWritingCampaignAssessmentResultsToStream({
        userId: user.id,
        campaignId: campaign.id,
        writableStream,
        i18n,
        campaignRepository,
        userRepository,
        targetProfileWithLearningContentRepository,
        organizationRepository,
        campaignParticipationInfoRepository,
        knowledgeElementRepository,
        badgeAcquisitionRepository,
        campaignCsvExportService,
      });

      const csv = await csvPromise;
      const csvLines = csv.split('\n');
      const csvFirstLineCells = csvLines[0].split(';');

      // then
      expect(csvFirstLineCells[0]).to.equal(expectedCsvFirstCell);
      expect(csvLines[1]).to.equal(csvSecondLine);
    });
  });
});
