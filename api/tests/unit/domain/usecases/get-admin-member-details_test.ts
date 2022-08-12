// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getAdminMemberDetails = require('../../../../lib/domain/usecases/get-admin-member-details');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-admin-member-details', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when it exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an admin member details', async function () {
      // given
      const adminMemberRepository = {
        get: sinon.stub(),
      };
      const adminMember = domainBuilder.buildAdminMember();
      adminMemberRepository.get.withArgs({ userId: adminMember.id }).resolves(adminMember);

      // when
      const adminMemberDetails = await getAdminMemberDetails({ adminMemberRepository, userId: adminMember.id });

      // then
      expect(adminMemberDetails).to.deep.equal(adminMember);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when it does not exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should thrown a NotFound error', async function () {
      // given
      const adminMemberRepository = {
        get: sinon.stub(),
      };
      const adminMember = domainBuilder.buildAdminMember();
      adminMemberRepository.get.withArgs({ userId: adminMember.id }).resolves(undefined);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getAdminMemberDetails)({ adminMemberRepository, userId: adminMember.id });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
