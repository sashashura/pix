// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReconc... Remove this comment to see the full error message
const userReconciliationService = require('../../../../lib/domain/services/user-reconciliation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerRepository = require('../../../../lib/infrastructure/repositories/sup-organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerRepository = require('../../../../lib/infrastructure/repositories/organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, OrganizationLearnerAlreadyLinkedToUserError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const reconcileSupOrganizationLearner = require('../../../../lib/domain/usecases/reconcile-sup-organization-learner');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | reconcile-sup-organization-learner', function () {
  let userId: $TSFixMe;
  let organizationId: $TSFixMe;
  let campaignCode: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(reconcileSupOrganizationLearner)({
        campaignCode: 'NOTEXIST',
        reconciliationInfo: {},
        campaignRepository,
      });

      // then
      expect(error).to.be.instanceof(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is a campaign with the given code', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser({
        firstName: 'Valentin',
        lastName: 'Frangin',
        birthdate: '2010-12-12',
      }).id;
      organizationId = databaseBuilder.factory.buildOrganization().id;
      campaignCode = databaseBuilder.factory.buildCampaign({ organizationId }).code;

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'When no registered organization learner found with matching student number, firstName, lastName and birthdate',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const reconciliationInfo = {
            userId,
            studentNumber: '123',
            firstName: 'firstname',
            lastName: 'lastname',
            birthdate: '2008-01-01',
          };
          databaseBuilder.factory.buildOrganizationLearner({ studentNumber: '123', userId: null, organizationId });
          await databaseBuilder.commit();

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(reconcileSupOrganizationLearner)({
            campaignCode,
            reconciliationInfo,
            campaignRepository,
            supOrganizationLearnerRepository,
            organizationLearnerRepository,
            userReconciliationService,
          });

          // then
          expect(error).to.be.instanceof(NotFoundError);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When a matching registered organization learner is found', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and is not reconciled yet', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reconcile organization learner with user', async function () {
          // given
          const reconciliationInfo = {
            userId,
            studentNumber: '123',
            firstName: 'firstname',
            lastName: 'lastname',
            birthdate: '2008-01-01',
          };
          databaseBuilder.factory.buildOrganizationLearner({
            ...reconciliationInfo,
            firstName: 'first name',
            userId: null,
            organizationId,
          });
          await databaseBuilder.commit();

          // when
          await reconcileSupOrganizationLearner({
            campaignCode,
            reconciliationInfo,
            campaignRepository,
            supOrganizationLearnerRepository,
            organizationLearnerRepository,
            userReconciliationService,
          });

          // then
          const [organizationLearner] = await knex('organization-learners');
          expect(organizationLearner.userId).to.equal(userId);
          expect(organizationLearner.firstName).to.equal('first name');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('but already reconciled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const reconciliationInfo = {
            userId,
            studentNumber: '123',
            firstName: 'firstname',
            lastName: 'lastname',
            birthdate: '2008-01-01',
          };
          const otherUserId = databaseBuilder.factory.buildUser().id;
          databaseBuilder.factory.buildOrganizationLearner({
            ...reconciliationInfo,
            userId: otherUserId,
            organizationId,
          });
          await databaseBuilder.commit();

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(reconcileSupOrganizationLearner)({
            campaignCode,
            reconciliationInfo,
            campaignRepository,
            supOrganizationLearnerRepository,
            organizationLearnerRepository,
            userReconciliationService,
          });

          // then
          expect(error).to.be.instanceOf(OrganizationLearnerAlreadyLinkedToUserError);
        });
      });
    });
  });
});
