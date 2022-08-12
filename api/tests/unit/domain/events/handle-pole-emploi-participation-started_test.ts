// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStarted = require('../../../../lib/domain/events/CampaignParticipationStarted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiSending = require('../../../../lib/domain/models/PoleEmploiSending');
// @ts-expect-error TS(2687): All declarations of 'handlePoleEmploiParticipation... Remove this comment to see the full error message
const { handlePoleEmploiParticipationStarted } = require('../../../../lib/domain/events')._forTestOnly.handlers;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-pole-emploi-participation-started', function () {
  let event: $TSFixMe, dependencies: $TSFixMe, expectedResults: $TSFixMe;
  let campaignRepository: $TSFixMe,
    campaignParticipationRepository: $TSFixMe,
    organizationRepository: $TSFixMe,
    targetProfileRepository: $TSFixMe,
    userRepository: $TSFixMe,
    poleEmploiNotifier: $TSFixMe,
    poleEmploiSendingRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignRepository = { get: sinon.stub() };
    campaignParticipationRepository = { get: sinon.stub() };
    organizationRepository = { get: sinon.stub() };
    targetProfileRepository = { get: sinon.stub() };
    userRepository = { get: sinon.stub() };
    poleEmploiNotifier = { notify: sinon.stub() };
    poleEmploiSendingRepository = { create: sinon.stub() };

    dependencies = {
      campaignRepository,
      campaignParticipationRepository,
      organizationRepository,
      poleEmploiSendingRepository,
      targetProfileRepository,
      userRepository,
      poleEmploiNotifier,
    };

    expectedResults = JSON.stringify({
      campagne: {
        nom: 'Campagne Pôle Emploi',
        dateDebut: '2020-01-01T00:00:00.000Z',
        dateFin: '2020-02-01T00:00:00.000Z',
        type: 'EVALUATION',
        codeCampagne: 'CODEPE123',
        urlCampagne: 'https://app.pix.fr/campagnes/CODEPE123',
        nomOrganisme: 'Pix',
        typeOrganisme: 'externe',
      },
      individu: {
        nom: 'Bonneau',
        prenom: 'Jean',
      },
      test: {
        etat: 2,
        progression: 0,
        typeTest: 'DI',
        referenceExterne: 55667788,
        dateDebut: '2020-01-02T00:00:00.000Z',
        dateProgression: null,
        dateValidation: null,
        evaluation: null,
        uniteEvaluation: 'A',
        elementsEvalues: [],
      },
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('fails when event is not of correct type', async function () {
    // given
    const event = 'not an event of the correct type';
    // when / then
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(handlePoleEmploiParticipationStarted)({ event, ...dependencies });

    // then
    expect(error).not.to.be.null;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#handlePoleEmploiParticipationStarted', function () {
    let campaignParticipationId: $TSFixMe, campaignId: $TSFixMe, userId: $TSFixMe, organizationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipationId = 55667788;
      campaignId = Symbol('campaignId');
      userId = Symbol('userId');
      organizationId = Symbol('organizationId');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign is of type ASSESSMENT and organization is Pole Emploi', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const campaign = domainBuilder.buildCampaign({
          id: campaignId,
          name: 'Campagne Pôle Emploi',
          code: 'CODEPE123',
          createdAt: new Date('2020-01-01'),
          archivedAt: new Date('2020-02-01'),
          type: 'ASSESSMENT',
          targetProfile: { id: 'targetProfileId1' },
          organization: { id: organizationId },
        });
        const campaignParticipation = domainBuilder.buildCampaignParticipation({
          id: campaignParticipationId,
          userId,
          campaign,
          createdAt: new Date('2020-01-02'),
        });

        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
        campaignRepository.get.withArgs(campaignId).resolves(campaign);
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: true });
        userRepository.get
          .withArgs(userId)
          .resolves(domainBuilder.buildUser({ id: userId, firstName: 'Jean', lastName: 'Bonneau' }));
        targetProfileRepository.get.withArgs('targetProfileId1').resolves({ name: 'Diagnostic initial' });

        event = new CampaignParticipationStarted({ campaignParticipationId });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should notify pole emploi and create pole emploi sending accordingly', async function () {
        // given
        const expectedResponse = { isSuccessful: 'someValue', code: 'someCode' };
        poleEmploiNotifier.notify.withArgs(userId, expectedResults).resolves(expectedResponse);
        const poleEmploiSending = Symbol('Pole emploi sending');
        sinon
          .stub(PoleEmploiSending, 'buildForParticipationStarted')
          .withArgs({
            campaignParticipationId,
            payload: expectedResults,
            isSuccessful: expectedResponse.isSuccessful,
            responseCode: expectedResponse.code,
          })
          .returns(poleEmploiSending);

        // when
        await handlePoleEmploiParticipationStarted({
          event,
          ...dependencies,
        });

        // then
        expect(poleEmploiSendingRepository.create).to.have.been.calledWith({ poleEmploiSending });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign is of type ASSESSMENT but organization is not Pole Emploi', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const campaign = domainBuilder.buildCampaign({
          id: campaignId,
          type: 'ASSESSMENT',
          organization: { id: organizationId },
        });
        const campaignParticipation = domainBuilder.buildCampaignParticipation({
          id: campaignParticipationId,
          userId,
          campaign,
          createdAt: new Date('2020-01-02'),
        });

        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
        campaignRepository.get.withArgs(campaignId).resolves(campaign);
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: false });

        event = new CampaignParticipationStarted({ campaignParticipationId });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not notify to Pole Emploi', async function () {
        // when
        await handlePoleEmploiParticipationStarted({
          event,
          ...dependencies,
        });

        // then
        sinon.assert.notCalled(poleEmploiNotifier.notify);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization is Pole Emploi but campaign is of type PROFILES_COLLECTION', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const campaign = domainBuilder.buildCampaign({
          id: campaignId,
          type: 'PROFILES_COLLECTION',
          organization: { id: organizationId },
        });
        const campaignParticipation = domainBuilder.buildCampaignParticipation({
          id: campaignParticipationId,
          userId,
          campaign,
          createdAt: new Date('2020-01-02'),
        });

        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(campaignParticipation);
        campaignRepository.get.withArgs(campaignId).resolves(campaign);
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: true });

        event = new CampaignParticipationStarted({ campaignParticipationId });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not notify to Pole Emploi', async function () {
        // when
        await handlePoleEmploiParticipationStarted({
          event,
          ...dependencies,
        });

        sinon.assert.notCalled(poleEmploiNotifier.notify);
      });
    });
  });
});
