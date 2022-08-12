// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedCertificationCenterSessionSummaries = require('../../../../lib/domain/usecases/find-paginated-certification-center-session-summaries');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | find-paginated-certification-center-session-summaries', function () {
  const sessionSummaryRepository = {
    findPaginatedByCertificationCenterId: () => undefined,
  };

  const userRepository = {
    getWithCertificationCenterMemberships: () => undefined,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sessionSummaryRepository.findPaginatedByCertificationCenterId = sinon.stub();
    userRepository.getWithCertificationCenterMemberships = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user is not a member of the certification center', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Forbidden Access error', async function () {
      // given
      const user = domainBuilder.buildUser();
      const certificationCenter = domainBuilder.buildCertificationCenter({ id: 789 });
      const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership({
        user,
        certificationCenter,
      });
      user.certificationCenterMemberships = [certificationCenterMembership];
      (userRepository.getWithCertificationCenterMemberships as $TSFixMe).withArgs(123).resolves(user);
      (sessionSummaryRepository.findPaginatedByCertificationCenterId as $TSFixMe).rejects(new Error('should not be called'));

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(findPaginatedCertificationCenterSessionSummaries)({
        userId: 123,
        certificationCenterId: 456,
        page: 'pagination-info',
        sessionSummaryRepository,
        userRepository,
      });

      // then
      expect(error).to.be.instanceOf(ForbiddenAccess);
      expect((error as $TSFixMe).message).to.equal('User 123 is not a member of certification center 456');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user is a member of the certification center', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return session summaries', async function () {
      // given
      const user = domainBuilder.buildUser();
      const certificationCenter = domainBuilder.buildCertificationCenter({ id: 456 });
      const certificationCenterMembership = domainBuilder.buildCertificationCenterMembership({
        user,
        certificationCenter,
      });
      user.certificationCenterMemberships = [certificationCenterMembership];
      (userRepository.getWithCertificationCenterMemberships as $TSFixMe).withArgs(123).resolves(user);
      const sessionSummaries = Symbol('session-summaries');
      const meta = Symbol('meta');
      (sessionSummaryRepository.findPaginatedByCertificationCenterId as $TSFixMe).withArgs({
    certificationCenterId: 456,
    page: 'pagination-info',
})
    .resolves({
    models: sessionSummaries,
    meta,
});

      // when
      const actualResult = await findPaginatedCertificationCenterSessionSummaries({
        userId: 123,
        certificationCenterId: 456,
        page: 'pagination-info',
        sessionSummaryRepository,
        userRepository,
      });

      // then
      expect(actualResult).to.deep.equal({
        models: sessionSummaries,
        meta,
      });
    });
  });
});
