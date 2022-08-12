// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('chai');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'service'.
const service = require('../../../../lib/domain/services/solution-service-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Services | solution-service-utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('treatmentT1T2T3', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should exist', function () {
      expect(service.treatmentT1T2T3).to.exist;
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return null if adminAnswers is not an array of String', function () {
      expect(service.treatmentT1T2T3('quack', [new Date(), new Date()])).to.equal(null);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return t1 treatment', function () {
      expect(service.treatmentT1T2T3(' Crème BrûLée 1 ', ['any']).t1).to.equal('cremebrulee1');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return t2 treatment', function () {
      expect(service.treatmentT1T2T3('Th!!is.,', ['any']).t2).to.equal('This');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return t1 & t2 treatment', function () {
      expect(service.treatmentT1T2T3('Th!!is., is  Crème BrûLée 1 ', ['any']).t1t2).to.equal('thisiscremebrulee1');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return t3 ratio', function () {
      expect(service.treatmentT1T2T3('beck', ['back', 'book']).t3Ratio).to.equal(0.25);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return t3 ratio applied to t1', function () {
      expect(service.treatmentT1T2T3(' Béck ', ['back', 'book']).t1t3Ratio).to.equal(0.25);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return t3 ratio applied to t2', function () {
      expect(service.treatmentT1T2T3('th!!is.', ['that', 'those']).t2t3Ratio).to.equal(0.5);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should return t3 ratio applied to t1 and t2', function () {
      expect(service.treatmentT1T2T3('éeE1', ['eee12', 'blabla']).t1t2t3Ratio).to.equal(0.25);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when we do not want apply treatments', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the same answer without treatment', function () {
        const userAnswer = 'ée E1';
        const answerTreated = service.treatmentT1T2T3(userAnswer, ['eee12', 'éeE1'], false);
        expect(answerTreated.t1).to.equal(userAnswer);
        expect(answerTreated.t1t2).to.equal(userAnswer);
        expect(answerTreated.t3Ratio).to.equal(1);
      });
    });
  });
});
