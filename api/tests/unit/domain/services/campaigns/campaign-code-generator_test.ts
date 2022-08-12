// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignCodeGenerator = require('../../../../../lib/domain/services/campaigns/campaign-code-generator');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Services | campaign code generator', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCampaignCode', function () {
    const campaignRepository = {
      isCodeAvailable: () => undefined,
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(campaignRepository, 'isCodeAvailable');
      (campaignRepository.isCodeAvailable as $TSFixMe).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a code with a length of 9 characters', function () {
      // when
      const promise = campaignCodeGenerator.generate(campaignRepository);

      // then
      return promise.then((code: $TSFixMe) => {
        expect(code.length).to.equal(9);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a code beginning with 6 letters', function () {
      // when
      const promise = campaignCodeGenerator.generate(campaignRepository);

      // then
      return promise.then((code: $TSFixMe) => {
        const codeLetters = code.substring(0, 6);
        expect(codeLetters).to.match(/^[A-Z]+$/);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a code finishing with 3 numbers', function () {
      // when
      const promise = campaignCodeGenerator.generate(campaignRepository);

      // then
      return promise.then((code: $TSFixMe) => {
        const codeNumbers = code.substring(6, 9);
        expect(codeNumbers).to.match(/^[0-9]+$/);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not be already assigned', function () {
      // given
(campaignRepository.isCodeAvailable as $TSFixMe).onCall(0).resolves(false);
      (campaignRepository.isCodeAvailable as $TSFixMe).onCall(1).resolves(true);

      // when
      const promise = campaignCodeGenerator.generate(campaignRepository);

      // then
      return promise.then((generatedCode: $TSFixMe) => {
        expect(campaignRepository.isCodeAvailable).to.have.been.called;

        const existingCampaignCode = (campaignRepository.isCodeAvailable as $TSFixMe).callsArg(0);
        expect(generatedCode).to.not.equal(existingCampaignCode);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not contains unreadable characters (I, l, 0)', function () {
      sinon.spy(randomString, 'generate');

      // when
      const promise = campaignCodeGenerator.generate(campaignRepository);

      // then
      return promise.then(() => {
        const firstCallArgumentsForLetters = randomString.generate.getCall(0).args[0];
        expect(firstCallArgumentsForLetters.readable).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not contains unreadable numbers (O)', function () {
      sinon.spy(randomString, 'generate');

      // when
      const promise = campaignCodeGenerator.generate(campaignRepository);

      // then
      return promise.then(() => {
        const secondCallArgumentsForNumbers = randomString.generate.getCall(1).args[0];
        expect(secondCallArgumentsForNumbers.readable).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should returns different campaign code from a given list when batch insert campaigns', function () {
      sinon.stub(randomString, 'generate');

      const pendingCodeNumbers = '345';
      const pendingCodeLetters = 'AZERTY';

      const pendingCode = pendingCodeLetters.concat(pendingCodeNumbers);

      // given
      randomString.generate.onCall(0).returns(pendingCodeLetters);
      randomString.generate.onCall(1).returns(pendingCodeNumbers);

      randomString.generate.onCall(2).returns('YTREZA');
      randomString.generate.onCall(3).returns('543');

      // when
      const promise = campaignCodeGenerator.generate(campaignRepository, [pendingCode]);

      // then
      return promise.then((generatedCode: $TSFixMe) => {
        expect(generatedCode).to.not.equal(pendingCode);
        expect(generatedCode).to.equal('YTREZA543');
      });
    });
  });
});
