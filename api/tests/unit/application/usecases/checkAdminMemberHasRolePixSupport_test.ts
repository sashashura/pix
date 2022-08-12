// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCase'.
const useCase = require('../../../../lib/application/usecases/checkAdminMemberHasRoleSupport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberRepository = require('../../../../lib/infrastructure/repositories/admin-member-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Use Case | checkAdminMemberHasRoleSupport', function () {
  const userId = '1234';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(tokenService, 'extractUserId').resolves(userId);
    sinon.stub(adminMemberRepository, 'get');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should resolve true when the user has role support', async function () {
    // given
    adminMemberRepository.get.resolves({ isSupport: true });

    // when
    const result = await useCase.execute(userId);
    // then
    expect(result).to.be.true;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should resolve false when the user does not have role support', async function () {
    // given
    adminMemberRepository.get.resolves({ isSupport: false });

    // when
    const result = await useCase.execute(userId);
    // then
    expect(result).to.be.false;
  });
});
