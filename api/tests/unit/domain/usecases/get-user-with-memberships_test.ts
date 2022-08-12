// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getUserWithMemberships = require('../../../../lib/domain/usecases/get-user-with-memberships');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-user-with-memberships', function () {
  let userRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    userRepository = { getWithMemberships: sinon.stub() };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return a User with its Memberships', async function () {
    // given
    const fetchedUser = domainBuilder.buildUser();
    userRepository.getWithMemberships.resolves(fetchedUser);

    // when
    const result = await getUserWithMemberships({
      userId: fetchedUser.id,
      userRepository,
    });

    // then
    expect(result).to.be.an.instanceOf(User);
    expect(result).to.equal(fetchedUser);
    expect(userRepository.getWithMemberships).to.have.been.calledOnce;
  });
});
