// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'poleEmploi... Remove this comment to see the full error message
const poleEmploiController = require('../../../../lib/application/pole-emploi/pole-emploi-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | pole-emploi-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getSendings', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a cursor in the url', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the pole emploi sending', async function () {
        // given
        const request = { query: { curseur: 'azefvbjljhgrEDJNH' } };
        const sending = [{ idEnvoi: 456 }];
        sinon.stub(usecases, 'getPoleEmploiSendings').resolves(sending);

        // when
        await poleEmploiController.getSendings(request, hFake);

        //then
        expect(usecases.getPoleEmploiSendings).have.been.calledWith({ cursor: 'azefvbjljhgrEDJNH', filters: {} });
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are filters', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when enErreur is 'false'", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the pole emploi sending', async function () {
          // given
          const request = { query: { curseur: 'azefvbjljhgrEDJNH', enErreur: false } };
          const sending = [{ idEnvoi: 456 }];
          sinon.stub(usecases, 'getPoleEmploiSendings').resolves(sending);

          // when
          await poleEmploiController.getSendings(request, hFake);

          //then
          expect(usecases.getPoleEmploiSendings).have.been.calledWith({
            cursor: 'azefvbjljhgrEDJNH',
            filters: { isSuccessful: true },
          });
        });
      });
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when enErreur is 'true'", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the pole emploi sending', async function () {
          // given
          const request = { query: { curseur: 'azefvbjljhgrEDJNH', enErreur: true } };
          const sending = [{ idEnvoi: 456 }];
          sinon.stub(usecases, 'getPoleEmploiSendings').resolves(sending);

          // when
          await poleEmploiController.getSendings(request, hFake);

          //then
          expect(usecases.getPoleEmploiSendings).have.been.calledWith({
            cursor: 'azefvbjljhgrEDJNH',
            filters: { isSuccessful: false },
          });
        });
      });
    });
  });
});
