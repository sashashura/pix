// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ShareableCertificate', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#setResultCompetenceTree', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should set the resultCompetenceTree on ShareableCertificate model', function () {
      // given
      const resultCompetenceTree = domainBuilder.buildResultCompetenceTree({ id: 'someId' });
      const shareableCertificate = domainBuilder.buildShareableCertificate();

      // when
      shareableCertificate.setResultCompetenceTree(resultCompetenceTree);

      // expect
      expect(shareableCertificate.resultCompetenceTree).to.deep.equal(resultCompetenceTree);
    });
  });
});
