// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCase'.
const useCase = require('../../../../lib/application/usecases/checkAdminMemberHasRoleCertif');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberRepository = require('../../../../lib/infrastructure/repositories/admin-member-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Use Case | checkAdminMemberHasRoleCertifUseCase', function () {
  const userId = '1234';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(tokenService, 'extractUserId').resolves(userId);
    sinon.stub(adminMemberRepository, 'get');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should resolve true when the admin member has role certif', async function () {
    // given
    adminMemberRepository.get.resolves({ isCertif: true });

    // when
    const result = await useCase.execute(userId);

    // then
    expect(result).to.be.true;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should resolve false when the admin member does not have role certif', async function () {
    // given
    adminMemberRepository.get.resolves({ isCertif: false });

    // when
    const result = await useCase.execute(userId);

    // then
    expect(result).to.be.false;
  });
});
