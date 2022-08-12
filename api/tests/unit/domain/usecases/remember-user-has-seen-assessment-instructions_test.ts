// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const rememberUserHasSeenAssessmentInstructions = require('../../../../lib/domain/usecases/remember-user-has-seen-assessment-instructions');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | remember-user-has-seen-assessment-instructions', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(userRepository, 'updateHasSeenAssessmentInstructionsToTrue');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update has seen assessment instructions', async function () {
    // given
    const userId = 'userId';
    const updatedUser = Symbol('updateduser');
    userRepository.updateHasSeenAssessmentInstructionsToTrue.resolves(updatedUser);

    // when
    const actualUpdatedUser = await rememberUserHasSeenAssessmentInstructions({ userId, userRepository });

    // then
    expect(userRepository.updateHasSeenAssessmentInstructionsToTrue).to.have.been.calledWith(userId);
    expect(actualUpdatedUser).to.equal(updatedUser);
  });
});
