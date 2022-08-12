// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const changeUserLang = require('../../../../lib/domain/usecases/change-user-lang');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | change-user-lang', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(userRepository, 'updateUserAttributes');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should modify user attributes to change lang', async function () {
    // given
    const userId = Symbol('userId');
    const updatedUser = Symbol('updateduser');
    const lang = 'jp';
    userRepository.updateUserAttributes.resolves(updatedUser);

    // when
    const actualUpdatedUser = await changeUserLang({ userId, lang, userRepository });

    // then
    expect(userRepository.updateUserAttributes).to.have.been.calledWith(userId, { lang });
    expect(actualUpdatedUser).to.equal(updatedUser);
  });
});
