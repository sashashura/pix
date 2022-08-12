// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiSending = require('../../../../lib/domain/models/PoleEmploiSending');
// @ts-expect-error TS(2687): All declarations of 'handlePoleEmploiParticipation... Remove this comment to see the full error message
const { handlePoleEmploiParticipationFinished } = require('../../../../lib/domain/events')._forTestOnly.handlers;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-pole-emploi-participation-finished', function () {
  let event: $TSFixMe, dependencies: $TSFixMe, expectedResults: $TSFixMe;
  let assessmentRepository: $TSFixMe,
    campaignRepository: $TSFixMe,
    campaignParticipationRepository: $TSFixMe,
    organizationRepository: $TSFixMe,
    targetProfileRepository: $TSFixMe,
    userRepository: $TSFixMe,
    poleEmploiNotifier: $TSFixMe,
    poleEmploiSendingRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    assessmentRepository = { get: sinon.stub() };
    campaignRepository = { get: sinon.stub() };
    campaignParticipationRepository = { get: sinon.stub() };
    organizationRepository = { get: sinon.stub() };
    targetProfileRepository = { get: sinon.stub() };
    userRepository = { get: sinon.stub() };
    poleEmploiNotifier = { notify: sinon.stub() };
    poleEmploiSendingRepository = { create: sinon.stub() };

    dependencies = {
      assessmentRepository,
      campaignRepository,
      campaignParticipationRepository,
      organizationRepository,
      targetProfileRepository,
      userRepository,
      poleEmploiNotifier,
      poleEmploiSendingRepository,
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
        etat: 3,
        progression: 100,
        typeTest: 'DI',
        referenceExterne: 55667788,
        dateDebut: '2020-01-02T00:00:00.000Z',
        dateProgression: '2020-01-03T00:00:00.000Z',
        dateValidation: null,
        evaluation: null,
        uniteEvaluation: 'A',
        elementsEvalues: [],
      },
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sinon.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('fails when event is not of correct type', async function () {
    // given
    const event = 'not an event of the correct type';
    // when / then
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(handlePoleEmploiParticipationFinished)({ event, ...dependencies });

    // then
    expect(error).not.to.be.null;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#handlePoleEmploiParticipationFinished', function () {
    let campaignId: $TSFixMe, userId: $TSFixMe, organizationId: $TSFixMe, assessmentId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignId = Symbol('campaignId');
      userId = Symbol('userId');
      organizationId = Symbol('organizationId');
      assessmentId = Symbol('assessmentId');
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
          id: 55667788,
          userId,
          campaign,
          assessments: [domainBuilder.buildAssessment({ id: assessmentId })],
          createdAt: new Date('2020-01-02'),
        });
        event = new AssessmentCompleted({ campaignParticipationId: campaignParticipation.id });

        campaignParticipationRepository.get.withArgs(campaignParticipation.id).resolves(campaignParticipation);
        assessmentRepository.get.withArgs(assessmentId).resolves(
          domainBuilder.buildAssessment({
            updatedAt: new Date('2020-01-03'),
          })
        );
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: true });
        userRepository.get
          .withArgs(userId)
          .resolves(domainBuilder.buildUser({ id: userId, firstName: 'Jean', lastName: 'Bonneau' }));
        campaignRepository.get.withArgs(campaignId).resolves(campaign);
        targetProfileRepository.get.withArgs('targetProfileId1').resolves({ name: 'Diagnostic initial' });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should notify pole emploi and create pole emploi sending accordingly', async function () {
        // given

        const expectedResponse = { isSuccessful: 'someValue', code: 'someCode' };
        poleEmploiNotifier.notify.withArgs(userId, expectedResults).resolves(expectedResponse);
        const poleEmploiSending = Symbol('Pole emploi sending');
        sinon
          .stub(PoleEmploiSending, 'buildForParticipationFinished')
          .withArgs({
            campaignParticipationId: 55667788,
            payload: expectedResults,
            isSuccessful: expectedResponse.isSuccessful,
            responseCode: expectedResponse.code,
          })
          .returns(poleEmploiSending);

        // when
        await handlePoleEmploiParticipationFinished({
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
          id: 55667788,
          userId,
          campaign,
          createdAt: new Date('2020-01-02'),
        });
        event = new AssessmentCompleted({ campaignParticipationId: campaignParticipation.id });

        campaignParticipationRepository.get.withArgs(campaignParticipation.id).resolves(campaignParticipation);
        campaignRepository.get.withArgs(campaignId).resolves(domainBuilder.buildCampaign(campaign));
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: false });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not notify to Pole Emploi', async function () {
        // when
        await handlePoleEmploiParticipationFinished({
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
          id: 55667788,
          userId,
          campaign,
          createdAt: new Date('2020-01-02'),
        });
        event = new AssessmentCompleted({ campaignParticipationId: campaignParticipation.id });

        campaignParticipationRepository.get.withArgs(campaignParticipation.id).resolves(campaignParticipation);
        campaignRepository.get.withArgs(campaignId).resolves(domainBuilder.buildCampaign(campaign));
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: true });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not notify to Pole Emploi', async function () {
        // when
        await handlePoleEmploiParticipationFinished({
          event,
          ...dependencies,
        });

        // then
        sinon.assert.notCalled(poleEmploiNotifier.notify);
      });
    });
  });
});
