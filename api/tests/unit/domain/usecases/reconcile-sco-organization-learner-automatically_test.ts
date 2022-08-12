// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerRepository = require('../../../../lib/infrastructure/repositories/organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
const { CampaignCodeError, UserCouldNotBeReconciledError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | reconcile-sco-organization-learner-automatically', function () {
  let reconcileUserByNationalStudentIdAndOrganizationIdStub: $TSFixMe;
  let campaignCode: $TSFixMe;
  let findByUserIdStub: $TSFixMe;
  let getCampaignStub: $TSFixMe;
  let organizationLearner: $TSFixMe;
  let userId: $TSFixMe;
  const organizationId = 1;
  const organizationLearnerId = 1;
  const nationalStudentId = '123456789AZ';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignCode = 'ABCD12';
    userId = domainBuilder.buildUser().id;
    organizationLearner = domainBuilder.buildOrganizationLearner({
      organizationId,
      id: organizationLearnerId,
      nationalStudentId,
    });

    getCampaignStub = sinon
      .stub(campaignRepository, 'getByCode')
      .withArgs(campaignCode)
      .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));

    reconcileUserByNationalStudentIdAndOrganizationIdStub = sinon.stub(
      organizationLearnerRepository,
      'reconcileUserByNationalStudentIdAndOrganizationId'
    );
    findByUserIdStub = sinon.stub(organizationLearnerRepository, 'findByUserId');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // given
      getCampaignStub.withArgs(campaignCode).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerAutomatically)({
        userId,
        campaignCode,
      });

      // then
      expect(result).to.be.instanceof(CampaignCodeError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner is found by userId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserCouldNotBeReconcile error', async function () {
      // given
      findByUserIdStub.resolves([]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerAutomatically)({
        userId,
        campaignCode,
      });

      // then
      expect(result).to.be.instanceof(UserCouldNotBeReconciledError);
      expect((result as $TSFixMe).message).to.equal("Cet utilisateur n'a pas pu être rattaché à une organisation.");
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner is found by organizationId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserCouldNotBeReconcile error', async function () {
      // given
      findByUserIdStub.resolves([organizationLearner]);
      reconcileUserByNationalStudentIdAndOrganizationIdStub.throws(new UserCouldNotBeReconciledError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerAutomatically)({
        userId,
        campaignCode,
      });

      // then
      expect(result).to.be.instanceof(UserCouldNotBeReconciledError);
      expect((result as $TSFixMe).message).to.equal("Cet utilisateur n'a pas pu être rattaché à une organisation.");
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner is found by nationalStudentId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserCouldNotBeReconcile error', async function () {
      // given
      findByUserIdStub.resolves([organizationLearner]);
      reconcileUserByNationalStudentIdAndOrganizationIdStub.throws(new UserCouldNotBeReconciledError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerAutomatically)({
        userId,
        campaignCode,
      });

      // then
      expect(result).to.be.instanceof(UserCouldNotBeReconciledError);
      expect((result as $TSFixMe).message).to.equal("Cet utilisateur n'a pas pu être rattaché à une organisation.");
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When organizationLearner is found', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should use nationalStudentId of more recent organizationLearner', async function () {
      // given
      const organizationLearnerInOtherOrganization = domainBuilder.buildOrganizationLearner({
        userId,
        updatedAt: '2020-07-10',
      });
      const mostRecentOrganizationLearnerInOtherOrganization = domainBuilder.buildOrganizationLearner({
        userId,
        nationalStudentId,
        updatedAt: '2020-07-20',
      });
      findByUserIdStub.resolves([
        organizationLearnerInOtherOrganization,
        mostRecentOrganizationLearnerInOtherOrganization,
      ]);
      reconcileUserByNationalStudentIdAndOrganizationIdStub
        .withArgs({
          userId,
          nationalStudentId,
          organizationId,
        })
        .resolves(organizationLearner);

      // when
      const result = await usecases.reconcileScoOrganizationLearnerAutomatically({
        userId,
        campaignCode,
      });

      // then
      expect(result).to.be.instanceOf(OrganizationLearner);
      expect(result).to.be.equal(organizationLearner);
    });
  });
});
