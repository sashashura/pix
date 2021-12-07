const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
const solutionServiceQrocmInd = require('../../../../lib/domain/services/solution-service-qrocm-ind');
const Validation = require('../../../../lib/domain/models/Validation');
const ValidatorQROCMInd = require('../../../../lib/domain/models/ValidatorQROCMInd');

const { expect, domainBuilder } = require('../../../test-helper');

describe('Integration | Domain | Models | ValidatorQROCMInd', function () {
  describe('#assess', function () {
    let uncorrectedAnswer;
    let validation;
    let validator;
    let solution;

    it('Should match answer solutions', function () {
      // given
      solution = domainBuilder.buildSolution({ type: 'QROCM-ind', value:`question1:
- Taille de 28 pouces ?
question2:
- "Freins à patins ?"
question3:
- "Prix inférieur à 400 euros ?"
question4:
- "Sans accessoire ?"
- éclairage à piles
- éclairage avec piles
- éclairage = piles`  });
      const expectedValidation = domainBuilder.buildValidation({
        result: AnswerStatus.OK,
        resultDetails: 'resultDetailYAMLString',
      });
      uncorrectedAnswer = domainBuilder.buildAnswer.uncorrected({value:`question1: Taille de 28 pouces ?
question2: "Freins à patins ?"
question3: "Prix inférieur à 400 euros ?"
question4: "Sans accessoire ?"`});
      validator = new ValidatorQROCMInd({ solution: solution });

      // when
      validation = validator.assess({ answer: uncorrectedAnswer });

      //then
      expect(validation).to.be.an.instanceOf(Validation);
      expect(validation).to.deep.equal(expectedValidation);
    });
  });
});
