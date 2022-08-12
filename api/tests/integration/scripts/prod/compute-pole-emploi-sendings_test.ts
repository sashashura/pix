// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
  domainBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computePol... Remove this comment to see the full error message
const computePoleEmploiSendings = require('../../../../scripts/prod/compute-pole-emploi-sendings');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiSending = require('../../../../lib/domain/models/PoleEmploiSending');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED } = CampaignParticipationStatuses;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingFactory = databaseBuilder.factory.poleEmploiSendingFactory;
function setLearningContent(learningContent: $TSFixMe) {
  const learningObjects = learningContentBuilder.buildLearningContent(learningContent);
  mockLearningContent(learningObjects);
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('computePoleEmploiSendings', function () {
  const code = 'CODEPE123';
  let campaignParticipationId: $TSFixMe, userId: $TSFixMe, campaignId: $TSFixMe;
  let skill1: $TSFixMe, skill2: $TSFixMe, competence1: $TSFixMe, competence2;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    sinon.stub(console, 'log');

    skill1 = domainBuilder.buildSkill({ id: 'skill1Id' }); // skill invalidated in assessment
    skill2 = domainBuilder.buildSkill({ id: 'skill2Id' }); // skill validated in assessment
    competence1 = domainBuilder.buildCompetence({ id: 'competence1Id', name: 'Competence 1', skillIds: [skill1.id] });
    competence2 = domainBuilder.buildCompetence({ id: 'competence2Id', name: 'Competence 2', skillIds: [skill2.id] });
    const learningContent = [
      {
        id: 'areaId',
        name: 'Area',
        competences: [
          {
            id: competence1.id,
            name: competence1.name,
            tubes: [
              {
                id: 'tube1Id',
                skills: [{ id: skill1.id, nom: '@web1' }],
              },
            ],
          },
          {
            id: competence2.id,
            name: competence2.name,
            tubes: [
              {
                id: 'tube2Id',
                skills: [{ id: skill2.id, nom: '@file1' }],
              },
            ],
          },
        ],
      },
    ];
    setLearningContent(learningContent);

    const organizationId = databaseBuilder.factory.buildOrganization().id;
    const tagId = databaseBuilder.factory.buildTag({ name: 'POLE EMPLOI' }).id;
    databaseBuilder.factory.buildOrganizationTag({ tagId, organizationId });
    const targetProfileId = databaseBuilder.factory.buildTargetProfile({ name: 'Diagnostic initial' }).id;
    [skill1, skill2].forEach((skill) =>
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: skill.id })
    );
    campaignId = databaseBuilder.factory.buildCampaign({
      name: 'Campagne Pôle Emploi',
      code,
      type: CampaignTypes.ASSESSMENT,
      organizationId,
      targetProfileId,
    }).id;
    userId = databaseBuilder.factory.buildUser({ firstName: 'Martin', lastName: 'Tamare' }).id;
    return databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('pole-emploi-sendings').delete();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when pole emploi sendings is missing for status CAMPAIGN_PARTICIPATION_START', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        campaignId,
        status: STARTED,
        sharedAt: null,
      }).id;
      databaseBuilder.factory.buildAssessment({ userId, campaignParticipationId, state: 'started', type: 'CAMPAIGN' });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create pole emploi sending', async function () {
      const payload = {
        campagne: {
          nom: 'Campagne Pôle Emploi',
          dateDebut: '2020-01-01T00:00:00.000Z',
          dateFin: null,
          type: 'EVALUATION',
          codeCampagne: 'CODEPE123',
          urlCampagne: 'https://app.pix.fr/campagnes/CODEPE123',
          nomOrganisme: 'Pix',
          typeOrganisme: 'externe',
        },
        individu: {
          nom: 'Tamare',
          prenom: 'Martin',
        },
        test: {
          etat: 2,
          progression: 0,
          typeTest: 'DI',
          referenceExterne: campaignParticipationId,
          dateDebut: '2020-01-01T00:00:00.000Z',
          dateProgression: null,
          dateValidation: null,
          evaluation: null,
          uniteEvaluation: 'A',
          elementsEvalues: [],
        },
      };
      const expectedResults = {
        campaignParticipationId,
        type: 'CAMPAIGN_PARTICIPATION_START',
        isSuccessful: false,
        responseCode: 'NOT_SENT',
        payload,
      };

      await computePoleEmploiSendings(code, 1);

      const [poleEmploiSending] = await knex('pole-emploi-sendings').where({
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_START,
      });
      expect(_.omit(poleEmploiSending, ['id', 'createdAt'])).to.deep.equal(expectedResults);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when pole emploi sendings is missing for status CAMPAIGN_PARTICIPATION_COMPLETION', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        campaignId,
        status: STARTED,
        sharedAt: null,
      }).id;
      databaseBuilder.factory.buildAssessment({
        userId,
        campaignParticipationId,
        state: 'completed',
        type: 'CAMPAIGN',
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create pole emploi sending', async function () {
      const payload = {
        campagne: {
          nom: 'Campagne Pôle Emploi',
          dateDebut: '2020-01-01T00:00:00.000Z',
          dateFin: null,
          type: 'EVALUATION',
          codeCampagne: 'CODEPE123',
          urlCampagne: 'https://app.pix.fr/campagnes/CODEPE123',
          nomOrganisme: 'Pix',
          typeOrganisme: 'externe',
        },
        individu: {
          nom: 'Tamare',
          prenom: 'Martin',
        },
        test: {
          etat: 3,
          progression: 100,
          typeTest: 'DI',
          referenceExterne: campaignParticipationId,
          dateDebut: '2020-01-01T00:00:00.000Z',
          dateProgression: '2020-01-02T00:00:00.000Z',
          dateValidation: null,
          evaluation: null,
          uniteEvaluation: 'A',
          elementsEvalues: [],
        },
      };
      const expectedResults = {
        campaignParticipationId,
        type: 'CAMPAIGN_PARTICIPATION_COMPLETION',
        isSuccessful: false,
        responseCode: 'NOT_SENT',
        payload,
      };

      await computePoleEmploiSendings(code, 1);

      const [poleEmploiSending] = await knex('pole-emploi-sendings').where({
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_COMPLETION,
      });
      expect(_.omit(poleEmploiSending, ['id', 'createdAt'])).to.deep.equal(expectedResults);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context(
    'when pole emploi sendings is missing for status CAMPAIGN_PARTICIPATION_COMPLETION and assessment has been improved',
    function () {
      let oldAssessment: $TSFixMe, assessmentImproving: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId,
          status: STARTED,
          sharedAt: null,
        }).id;
        oldAssessment = databaseBuilder.factory.buildAssessment({
          userId,
          campaignParticipationId,
          state: 'completed',
          type: 'CAMPAIGN',
          updatedAt: new Date('2020-10-10'),
        });
        assessmentImproving = databaseBuilder.factory.buildAssessment({
          userId,
          campaignParticipationId,
          state: 'completed',
          type: 'CAMPAIGN',
          updatedAt: new Date('2020-12-12'),
          isImproving: true,
        });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create pole emploi sending', async function () {
        await computePoleEmploiSendings(code, 1);

        const poleEmploiSendings = await knex('pole-emploi-sendings').where({
          type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_COMPLETION,
        });
        expect(poleEmploiSendings).to.have.lengthOf(2);
        expect(_.map(poleEmploiSendings, 'payload.test.dateProgression')).to.have.members([
          oldAssessment.updatedAt.toISOString(),
          assessmentImproving.updatedAt.toISOString(),
        ]);
      });
    }
  );

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when pole emploi sendings is missing for status CAMPAIGN_PARTICIPATION_SHARING', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        campaignId,
        sharedAt: new Date('2021-10-10'),
      }).id;
      const assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        campaignParticipationId,
        state: 'completed',
        type: 'CAMPAIGN',
      }).id;
      const ke1 = databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        skillId: skill1.id,
        assessmentId,
        userId,
        competenceId: competence1.id,
      });
      const ke2 = databaseBuilder.factory.buildKnowledgeElement({
        status: 'invalidated',
        skillId: skill2.id,
        assessmentId,
        userId,
        competenceId: competence1.id,
      });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({
        userId,
        snappedAt: new Date('2021-10-10'),
        snapshot: JSON.stringify([ke1, ke2]),
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create pole emploi sending', async function () {
      const payload = {
        campagne: {
          nom: 'Campagne Pôle Emploi',
          dateDebut: '2020-01-01T00:00:00.000Z',
          dateFin: null,
          type: 'EVALUATION',
          codeCampagne: 'CODEPE123',
          urlCampagne: 'https://app.pix.fr/campagnes/CODEPE123',
          nomOrganisme: 'Pix',
          typeOrganisme: 'externe',
        },
        individu: {
          nom: 'Tamare',
          prenom: 'Martin',
        },
        test: {
          etat: 4,
          progression: 100,
          typeTest: 'DI',
          referenceExterne: campaignParticipationId,
          dateDebut: '2020-01-01T00:00:00.000Z',
          dateProgression: '2021-10-10T00:00:00.000Z',
          dateValidation: '2021-10-10T00:00:00.000Z',
          evaluation: 50,
          uniteEvaluation: 'A',
          elementsEvalues: [
            {
              libelle: 'Competence 1',
              categorie: 'competence',
              type: 'competence Pix',
              domaineRattachement: 'Area',
              nbSousElements: 1,
              evaluation: {
                scoreObtenu: 100,
                uniteScore: 'A',
                nbSousElementValide: 1,
              },
            },
            {
              libelle: 'Competence 2',
              categorie: 'competence',
              type: 'competence Pix',
              domaineRattachement: 'Area',
              nbSousElements: 1,
              evaluation: {
                scoreObtenu: 0,
                uniteScore: 'A',
                nbSousElementValide: 0,
              },
            },
          ],
        },
      };
      const expectedResults = {
        campaignParticipationId,
        type: 'CAMPAIGN_PARTICIPATION_SHARING',
        isSuccessful: false,
        responseCode: 'NOT_SENT',
        payload,
      };

      await computePoleEmploiSendings(code, 1);

      const [poleEmploiSending] = await knex('pole-emploi-sendings').where({
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_SHARING,
      });
      expect(_.omit(poleEmploiSending, ['id', 'createdAt'])).to.deep.equal(expectedResults);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when pole emploi sendings is missing for all statuses', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        campaignId,
        sharedAt: new Date('2021-10-10'),
      }).id;
      databaseBuilder.factory.buildAssessment({
        userId,
        campaignParticipationId,
        state: 'completed',
        type: 'CAMPAIGN',
      });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({
        userId,
        snappedAt: new Date('2021-10-10'),
        snapshot: JSON.stringify([]),
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create 3 pole emploi sendings', async function () {
      await computePoleEmploiSendings(code, 1);

      const poleEmploiSendings = await knex('pole-emploi-sendings');
      expect(poleEmploiSendings).to.have.lengthOf(3);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when only one pole emploi sendings is missing', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        campaignId,
        sharedAt: new Date('2021-10-10'),
      }).id;
      poleEmploiSendingFactory.build({
        campaignParticipationId,
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_START,
      });
      poleEmploiSendingFactory.build({
        campaignParticipationId,
        type: PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_COMPLETION,
      });
      databaseBuilder.factory.buildAssessment({
        userId,
        campaignParticipationId,
        state: 'completed',
        type: 'CAMPAIGN',
      });
      databaseBuilder.factory.buildKnowledgeElementSnapshot({
        userId,
        snappedAt: new Date('2021-10-10'),
        snapshot: JSON.stringify([]),
      });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should only create pole emploi sending missing', async function () {
      await computePoleEmploiSendings(code, 1);

      const poleEmploiSendings = await knex('pole-emploi-sendings');
      expect(poleEmploiSendings).to.have.lengthOf(3);
    });
  });
});
