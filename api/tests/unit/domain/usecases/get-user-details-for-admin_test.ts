// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getUserDetailsForAdmin = require('../../../../lib/domain/usecases/get-user-details-for-admin');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-user-details-for-admin', function () {
  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = { getUserDetailsForAdmin: sinon.stub() };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get the user details in administration context', async function () {
    // given
    const userId = 1;
    const expectedUserDetailsForAdmin = { id: userId };

    userRepository.getUserDetailsForAdmin.withArgs(userId).resolves({ id: userId });

    // when
    const result = await getUserDetailsForAdmin({ userId, userRepository });

    // then
    expect(result).to.deep.equal(expectedUserDetailsForAdmin);
  });
});
