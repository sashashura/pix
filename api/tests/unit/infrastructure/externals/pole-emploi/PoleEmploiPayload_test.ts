// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiPayload = require('../../../../../lib/infrastructure/externals/pole-emploi/PoleEmploiPayload');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Externals | Pole-Emploi | PoleEmploiPayload', function () {
  let user: $TSFixMe;
  let campaign: $TSFixMe;
  let targetProfile: $TSFixMe;
  let assessment: $TSFixMe;
  let participation: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    user = domainBuilder.buildUser();
    targetProfile = domainBuilder.buildTargetProfile({ name: 'Diagnostic initial' });
    campaign = domainBuilder.buildCampaign.ofTypeAssessment({ targetProfileId: targetProfile.id });
    assessment = domainBuilder.buildAssessment({ userId: user.id });
    participation = domainBuilder.buildCampaignParticipation({
      campaign,
      userId: user.id,
      assessments: [assessment],
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildForParticipationStarted', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build individu payload for a campaign participation started', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationStarted({
        user,
        campaign,
        participation,
        targetProfile,
      });

      // then
      expect(payload.individu).to.deep.equal({
        nom: user.lastName,
        prenom: user.firstName,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build campagne payload for a campaign participation started', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationStarted({
        user,
        campaign,
        participation,
        targetProfile,
      });

      // then
      expect(payload.campagne).to.deep.equal({
        nom: campaign.name,
        dateDebut: campaign.createdAt,
        dateFin: campaign.archivedAt,
        type: 'EVALUATION',
        codeCampagne: campaign.code,
        urlCampagne: `https://app.pix.fr/campagnes/${campaign.code}`,
        nomOrganisme: 'Pix',
        typeOrganisme: 'externe',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build test payload for a campaign participation started', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationStarted({
        user,
        campaign,
        participation,
        targetProfile,
      });

      // then
      expect(payload.test).to.deep.equal({
        etat: 2,
        progression: 0,
        typeTest: 'DI',
        referenceExterne: participation.id,
        dateDebut: participation.createdAt,
        dateProgression: null,
        dateValidation: null,
        evaluation: null,
        uniteEvaluation: 'A',
        elementsEvalues: [],
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildForParticipationFinished', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build individu payload for a campaign participation finished', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationFinished({
        user,
        campaign,
        participation,
        targetProfile,
        assessment,
      });

      // then
      expect(payload.individu).to.deep.equal({
        nom: user.lastName,
        prenom: user.firstName,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build campagne payload for a campaign participation finished', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationFinished({
        user,
        campaign,
        participation,
        targetProfile,
        assessment,
      });

      // then
      expect(payload.campagne).to.deep.equal({
        nom: campaign.name,
        dateDebut: campaign.createdAt,
        dateFin: campaign.archivedAt,
        type: 'EVALUATION',
        codeCampagne: campaign.code,
        urlCampagne: `https://app.pix.fr/campagnes/${campaign.code}`,
        nomOrganisme: 'Pix',
        typeOrganisme: 'externe',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build test payload for a campaign participation finished', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationFinished({
        user,
        campaign,
        participation,
        targetProfile,
        assessment,
      });

      // then
      expect(payload.test).to.deep.equal({
        etat: 3,
        progression: 100,
        typeTest: 'DI',
        referenceExterne: participation.id,
        dateDebut: participation.createdAt,
        dateProgression: assessment.updatedAt,
        dateValidation: null,
        evaluation: null,
        uniteEvaluation: 'A',
        elementsEvalues: [],
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildForParticipationShared', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build individu payload for a campaign participation shared', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationShared({
        user,
        campaign,
        participation,
        targetProfile,
        participationResult: {},
      });

      // then
      expect(payload.individu).to.deep.equal({
        nom: user.lastName,
        prenom: user.firstName,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build campagne payload for a campaign participation shared', function () {
      // when
      const payload = PoleEmploiPayload.buildForParticipationShared({
        user,
        campaign,
        participation,
        targetProfile,
        participationResult: {},
      });

      // then
      expect(payload.campagne).to.deep.equal({
        nom: campaign.name,
        dateDebut: campaign.createdAt,
        dateFin: campaign.archivedAt,
        type: 'EVALUATION',
        codeCampagne: campaign.code,
        urlCampagne: `https://app.pix.fr/campagnes/${campaign.code}`,
        nomOrganisme: 'Pix',
        typeOrganisme: 'externe',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build test payload for a campaign participation shared', function () {
      // given
      const participationResult = domainBuilder.buildCampaignParticipationResult({
        totalSkillsCount: 10,
        validatedSkillsCount: 7,
        competenceResults: [
          domainBuilder.buildCompetenceResult({
            name: 'Gérer des données',
            areaName: 'Information et données',
            totalSkillsCount: 4,
            testedSkillsCount: 2,
            validatedSkillsCount: 2,
          }),
        ],
      });

      // when
      const payload = PoleEmploiPayload.buildForParticipationShared({
        user,
        campaign,
        participation,
        targetProfile,
        participationResult,
      });

      // then
      expect(payload.test).to.deep.equal({
        etat: 4,
        progression: 100,
        typeTest: 'DI',
        referenceExterne: participation.id,
        dateDebut: participation.createdAt,
        dateProgression: participation.sharedAt,
        dateValidation: participation.sharedAt,
        evaluation: 70,
        uniteEvaluation: 'A',
        elementsEvalues: [
          {
            libelle: 'Gérer des données',
            categorie: 'competence',
            type: 'competence Pix',
            domaineRattachement: 'Information et données',
            nbSousElements: 4,
            evaluation: {
              scoreObtenu: 50,
              uniteScore: 'A',
              nbSousElementValide: 2,
            },
          },
        ],
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('map different test types in the payload', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should map test type with target profile name "Diagnostic initial"', function () {
      // given
      targetProfile = domainBuilder.buildTargetProfile({ name: 'Diagnostic initial' });

      // when
      const payload = PoleEmploiPayload.buildForParticipationStarted({
        user,
        campaign,
        participation,
        targetProfile,
      });

      // then
      expect(payload.test.typeTest).equal('DI');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should map test type with target profile name "Parcours complet"', function () {
      // given
      targetProfile = domainBuilder.buildTargetProfile({ name: 'Parcours complet' });

      // when
      const payload = PoleEmploiPayload.buildForParticipationStarted({
        user,
        campaign,
        participation,
        targetProfile,
      });

      // then
      expect(payload.test.typeTest).equal('PC');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should map test type with other target profile names ', function () {
      // given
      targetProfile = domainBuilder.buildTargetProfile({ name: 'Other' });

      // when
      const payload = PoleEmploiPayload.buildForParticipationStarted({
        user,
        campaign,
        participation,
        targetProfile,
      });

      // then
      expect(payload.test.typeTest).equal('CP');
    });
  });
});
