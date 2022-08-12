// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiService = require('../../../../lib/domain/services/pole-emploi-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingRepository = require('../../../../lib/infrastructure/repositories/pole-emploi-sending-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiSendingFactory = databaseBuilder.factory.poleEmploiSendingFactory;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | get-campaign-participations-counts-by-stage', function () {
  let originalEnv: $TSFixMe;
  let sending1: $TSFixMe;
  let sending2: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    originalEnv = settings.apiManager.url;
    settings.apiManager.url = 'https://fake-url.fr';

    sending1 = poleEmploiSendingFactory.buildWithUser({ createdAt: new Date('2021-03-01'), isSuccessful: true });
    sending2 = poleEmploiSendingFactory.buildWithUser({ createdAt: new Date('2021-04-01'), isSuccessful: false });

    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    settings.apiManager.url = originalEnv;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is no cursor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the most recent sendings', async function () {
      //given
      const cursor = null;

      //when
      const expectedLink = poleEmploiService.generateLink({ idEnvoi: sending1.id, dateEnvoi: sending1.createdAt });

      const response = await usecases.getPoleEmploiSendings({ cursor, poleEmploiSendingRepository });
      //then
      expect(response.sendings.map((sending: $TSFixMe) => sending.idEnvoi)).to.deep.equal([sending2.id, sending1.id]);
      expect(response.link).to.equal(expectedLink);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is a cursor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a sending with a link', async function () {
      //given
      const cursorCorrespondingToSending2 = poleEmploiService.generateCursor({
        idEnvoi: sending2.id,
        dateEnvoi: sending2.createdAt,
      });
      const expectedLink = poleEmploiService.generateLink({ idEnvoi: sending1.id, dateEnvoi: sending1.createdAt });

      //when
      const response = await usecases.getPoleEmploiSendings({
        cursor: cursorCorrespondingToSending2,
        poleEmploiSendingRepository,
      });
      //then
      expect(response.sendings.map((sending: $TSFixMe) => sending.idEnvoi)).to.deep.equal([sending1.id]);
      expect(response.link).to.equal(expectedLink);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a sending with a link with filters', async function () {
      //given
      const filters = { isSuccessful: true };
      const cursorCorrespondingToSending2 = poleEmploiService.generateCursor({
        idEnvoi: sending2.id,
        dateEnvoi: sending2.createdAt,
      });
      const expectedLink = poleEmploiService.generateLink(
        { idEnvoi: sending1.id, dateEnvoi: sending1.createdAt },
        filters
      );

      //when
      const response = await usecases.getPoleEmploiSendings({
        cursor: cursorCorrespondingToSending2,
        filters,
        poleEmploiSendingRepository,
      });
      //then
      expect(response.sendings.map((sending: $TSFixMe) => sending.idEnvoi)).to.deep.equal([sending1.id]);
      expect(response.link).to.equal(expectedLink);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is a cursor but there is no more sending', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return neither a sending nor a link', async function () {
      //given
      const cursorCorrespondingToSending1 = poleEmploiService.generateCursor({
        idEnvoi: sending1.id,
        dateEnvoi: sending1.createdAt,
      });

      //when
      const response = await usecases.getPoleEmploiSendings({
        cursor: cursorCorrespondingToSending1,
        poleEmploiSendingRepository,
      });

      //then
      expect(response.sendings).to.deep.equal([]);
      expect(response.link).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns sendings which match the filters', async function () {
    //when
    const { sendings } = await usecases.getPoleEmploiSendings({
      cursor: null,
      poleEmploiSendingRepository,
      filters: { isSuccessful: false },
    });

    //then
    expect(sendings.map(({
      idEnvoi
    }: $TSFixMe) => idEnvoi)).to.exactlyContain([sending2.id]);
  });
});
