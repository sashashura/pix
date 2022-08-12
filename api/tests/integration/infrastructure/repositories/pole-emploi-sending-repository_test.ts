// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingRepository = require('../../../../lib/infrastructure/repositories/pole-emploi-sending-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingFactory = databaseBuilder.factory.poleEmploiSendingFactory;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | PoleEmploiSending', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('pole-emploi-sendings').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save PoleEmploiSending', async function () {
      // given
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation().id;
      await databaseBuilder.commit();
      const poleEmploiSending = domainBuilder.buildPoleEmploiSending({ campaignParticipationId });

      // when
      await poleEmploiSendingRepository.create({ poleEmploiSending });

      // then
      const poleEmploiSendings = await knex('pole-emploi-sendings').select();
      expect(poleEmploiSendings).to.have.lengthOf(1);
      expect(_.omit(poleEmploiSendings[0], ['id', 'createdAt'])).to.deep.equal(poleEmploiSending);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#find', function () {
    let originalEnvPoleEmploiSendingsLimit: $TSFixMe;
    let sending1: $TSFixMe;
    let sending2: $TSFixMe;
    let sending3: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      originalEnvPoleEmploiSendingsLimit = settings.poleEmploi.poleEmploiSendingsLimit;
      settings.poleEmploi.poleEmploiSendingsLimit = 3;
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      settings.poleEmploi.poleEmploiSendingsLimit = originalEnvPoleEmploiSendingsLimit;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should render sendings with idPoleEmploi inside the object', async function () {
      poleEmploiSendingFactory.buildWithUser({}, 'externalUserId1');
      await databaseBuilder.commit();

      const [sending] = await poleEmploiSendingRepository.find();

      expect(sending.resultat.individu.idPoleEmploi).to.equal('externalUserId1');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should render existing sendings using poleEmploiSendingsLimit', async function () {
      poleEmploiSendingFactory.buildWithUser();
      poleEmploiSendingFactory.buildWithUser();
      poleEmploiSendingFactory.buildWithUser();
      poleEmploiSendingFactory.buildWithUser();

      await databaseBuilder.commit();

      const sendings = await poleEmploiSendingRepository.find();

      expect(sendings).to.have.lengthOf(3);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a cursor', function () {
      let expectedSending: $TSFixMe;
      let sendingInCursor: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        expectedSending = poleEmploiSendingFactory.buildWithUser({ createdAt: '2021-03-01' });
        sendingInCursor = poleEmploiSendingFactory.buildWithUser({ createdAt: '2021-04-01' });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return sendings where the date is before de given date', async function () {
        const { id: idEnvoi, createdAt: dateEnvoi } = sendingInCursor;

        const [sending] = await poleEmploiSendingRepository.find({ idEnvoi, dateEnvoi });

        expect(sending.idEnvoi).to.equal(expectedSending.id);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participant has several authentication method', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should render only one sending', async function () {
        const { id: userId } = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
          userId,
          identityProvider: 'PIX',
        });
        databaseBuilder.factory.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
          userId,
          externalIdentifier: 'idPoleEmploi',
        });
        const { id: campaignParticipationId } = databaseBuilder.factory.buildCampaignParticipation({ userId });
        poleEmploiSendingFactory.build({ campaignParticipationId });

        await databaseBuilder.commit();

        const sendings = await poleEmploiSendingRepository.find();

        expect(sendings.length).to.be.equal(1);
        expect(sendings[0].resultat.individu.idPoleEmploi).to.be.equal('idPoleEmploi');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('order', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        sending1 = poleEmploiSendingFactory.buildWithUser({ createdAt: '2021-03-01' });
        sending2 = poleEmploiSendingFactory.buildWithUser({ createdAt: '2021-04-01' });
        sending3 = poleEmploiSendingFactory.buildWithUser({ createdAt: '2021-05-01' });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should render sendings order by date', async function () {
        const sendings = await poleEmploiSendingRepository.find();

        expect(sendings.map((sending: $TSFixMe) => sending.idEnvoi)).to.deep.equal([sending3.id, sending2.id, sending1.id]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on isSucccessful', function () {
      let sendingSent: $TSFixMe;
      let sendingNotSent: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        sendingSent = poleEmploiSendingFactory.buildWithUser({ isSuccessful: true });
        sendingNotSent = poleEmploiSendingFactory.buildWithUser({ isSuccessful: false });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the sendings which have been sent correctly', async function () {
        const sendings = await poleEmploiSendingRepository.find(null, { isSuccessful: true });
        const sendingIds = sendings.map((sending: $TSFixMe) => sending.idEnvoi);
        expect(sendingIds).to.exactlyContain([sendingSent.id]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the sendings which have been not sent correctly', async function () {
        const sendings = await poleEmploiSendingRepository.find(null, { isSuccessful: false });
        const sendingIds = sendings.map((sending: $TSFixMe) => sending.idEnvoi);
        expect(sendingIds).to.exactlyContain([sendingNotSent.id]);
      });
    });
  });
});
