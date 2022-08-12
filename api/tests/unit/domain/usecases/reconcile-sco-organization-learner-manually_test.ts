// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
  UserShouldNotBeReconciledOnAnotherAccountError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | reconcile-sco-organization-learner-manually', function () {
  let campaignCode: $TSFixMe;

  let campaignRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;
  let userReconciliationService: $TSFixMe;

  let organizationLearner: $TSFixMe;
  let user: $TSFixMe;
  const organizationId = 1;
  const organizationLearnerId = 1;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignCode = 'ABCD12';
    organizationLearner = domainBuilder.buildOrganizationLearner({ organizationId, id: organizationLearnerId });
    user = {
      id: 1,
      firstName: 'Joe',
      lastName: 'Poe',
      birthdate: '02/02/1992',
    };

    campaignRepository = {
      getByCode: sinon.stub(),
    };
    organizationLearnerRepository = {
      reconcileUserToOrganizationLearner: sinon.stub(),
      findOneByUserIdAndOrganizationId: sinon.stub(),
      findByUserId: sinon.stub(),
    };
    userReconciliationService = {
      findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser: sinon.stub(),
      checkIfStudentHasAnAlreadyReconciledAccount: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // given
      campaignRepository.getByCode.withArgs(campaignCode).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerManually)({
        reconciliationInfo: user,
        campaignCode,
        campaignRepository,
      });

      // then
      expect(result).to.be.instanceof(CampaignCodeError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner found', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Not Found error', async function () {
      // given
      campaignRepository.getByCode
        .withArgs(campaignCode)
        .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));
      userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.throws(
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        new NotFoundError('Error message')
      );

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerManually)({
        reconciliationInfo: user,
        campaignCode,
        campaignRepository,
        userReconciliationService,
      });

      // then
      expect(result).to.be.instanceof(NotFoundError);
      expect((result as $TSFixMe).message).to.equal('Error message');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When student has already a reconciled account', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a OrganizationLearnerAlreadyLinkedToUser error', async function () {
      // given
      campaignRepository.getByCode
        .withArgs(campaignCode)
        .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));
      userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
        organizationLearner
      );
      userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.throws(
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        new OrganizationLearnerAlreadyLinkedToUserError()
      );

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerManually)({
        reconciliationInfo: user,
        campaignCode,
        campaignRepository,
        userReconciliationService,
      });

      // then
      expect(result).to.be.instanceof(OrganizationLearnerAlreadyLinkedToUserError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When another student is already reconciled in the same organization and with the same user', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a OrganizationLearnerAlreadyLinkedToUser error', async function () {
      // given
      organizationLearner.userId = user.id;
      organizationLearner.firstName = user.firstName;
      organizationLearner.lastName = user.lastName;

      const alreadyReconciledOrganizationLearnerWithAnotherStudent = domainBuilder.buildOrganizationLearner({
        organizationId,
        userId: user.id,
      });

      const exceptedErrorMessage =
        'Un autre étudiant est déjà réconcilié dans la même organisation et avec le même compte utilisateur';
      campaignRepository.getByCode
        .withArgs(campaignCode)
        .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));
      userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
        organizationLearner
      );
      userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
      organizationLearnerRepository.findOneByUserIdAndOrganizationId
        .withArgs({
          userId: user.id,
          organizationId,
        })
        .resolves(alreadyReconciledOrganizationLearnerWithAnotherStudent);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(usecases.reconcileScoOrganizationLearnerManually)({
        reconciliationInfo: user,
        campaignCode,
        campaignRepository,
        userReconciliationService,
        organizationLearnerRepository,
      });

      // then
      expect(result).to.be.instanceof(OrganizationLearnerAlreadyLinkedToUserError);
      expect((result as $TSFixMe).message).to.equal(exceptedErrorMessage);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When student is trying to be reconciled on an account', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('And the national student ids are different', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('And birthdays are identical', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reconcile accounts', async function () {
          // given
          const currentOrganizationId = 5;
          const previousOrganizationId = 4;
          const reconciliationInfo = {
            id: 1,
            firstName: 'Guy',
            lastName: 'Tar',
            birthdate: '07/12/1996',
          };

          const campaign = domainBuilder.buildCampaign();
          const currentOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 7,
            birthdate: '07/12/1996',
            nationalStudentId: 'currentINE',
            organizationId: currentOrganizationId,
          });
          const previousOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 6,
            userId: reconciliationInfo.id,
            birthdate: '07/12/1996',
            nationalStudentId: 'oldINE',
            organizationId: previousOrganizationId,
          });

          campaignRepository.getByCode.resolves(campaign);
          userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
            currentOrganizationLearner
          );
          userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
          organizationLearnerRepository.findOneByUserIdAndOrganizationId.resolves();
          organizationLearnerRepository.findByUserId.withArgs({ userId: 1 }).resolves([previousOrganizationLearner]);
          organizationLearnerRepository.reconcileUserToOrganizationLearner.resolves(currentOrganizationLearner);

          // when
          await usecases.reconcileScoOrganizationLearnerManually({
            reconciliationInfo,
            withReconciliation: true,
            campaignCode,
            campaignRepository,
            userReconciliationService,
            organizationLearnerRepository,
          });

          // then
          expect(organizationLearnerRepository.reconcileUserToOrganizationLearner).to.have.been.calledOnceWithExactly({
            userId: reconciliationInfo.id,
            organizationLearnerId: currentOrganizationLearner.id,
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('And birthdays are different', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw UserShouldNotBeReconciledOnAnotherAccountError error', async function () {
          // given
          const currentOrganizationId = 5;
          const previousOrganizationId = 4;
          const reconciliationInfo = {
            id: 1,
            firstName: 'Guy',
            lastName: 'Tar',
            birthdate: '07/12/1996',
          };

          const campaign = domainBuilder.buildCampaign();
          const currentOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 7,
            birthdate: '08/10/1980',
            nationalStudentId: 'currentINE',
            organizationId: currentOrganizationId,
          });
          const previousOrganizationLearner = domainBuilder.buildOrganizationLearner({
            id: 6,
            userId: reconciliationInfo.id,
            birthdate: '07/12/1996',
            nationalStudentId: 'oldINE',
            organizationId: previousOrganizationId,
          });

          campaignRepository.getByCode.resolves(campaign);
          userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
            currentOrganizationLearner
          );
          userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
          organizationLearnerRepository.findOneByUserIdAndOrganizationId.resolves();
          organizationLearnerRepository.findByUserId.withArgs({ userId: 1 }).resolves([previousOrganizationLearner]);

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(usecases.reconcileScoOrganizationLearnerManually)({
            reconciliationInfo,
            withReconciliation: true,
            campaignCode,
            campaignRepository,
            userReconciliationService,
            organizationLearnerRepository,
          });

          // then
          expect(error).to.be.instanceOf(UserShouldNotBeReconciledOnAnotherAccountError);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('And the national student ids are identical', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reconcile accounts', async function () {
        // given
        const currentOrganizationId = 5;
        const previousOrganizationId = 4;
        const reconciliationInfo = {
          id: 1,
          firstName: 'Guy',
          lastName: 'Tar',
          birthdate: '07/12/1996',
        };

        const campaign = domainBuilder.buildCampaign();
        const currentOrganizationLearner = domainBuilder.buildOrganizationLearner({
          id: 7,
          birthdate: '07/12/1996',
          nationalStudentId: 'similarINE',
          organizationId: currentOrganizationId,
        });
        const previousOrganizationLearner = domainBuilder.buildOrganizationLearner({
          id: 6,
          userId: reconciliationInfo.id,
          birthdate: '07/12/1980',
          nationalStudentId: 'similarINE',
          organizationId: previousOrganizationId,
        });

        campaignRepository.getByCode.resolves(campaign);
        userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
          currentOrganizationLearner
        );
        userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
        organizationLearnerRepository.findOneByUserIdAndOrganizationId.resolves();
        organizationLearnerRepository.findByUserId.withArgs({ userId: 1 }).resolves([previousOrganizationLearner]);
        organizationLearnerRepository.reconcileUserToOrganizationLearner.resolves(currentOrganizationLearner);

        // when
        await usecases.reconcileScoOrganizationLearnerManually({
          reconciliationInfo,
          withReconciliation: true,
          campaignCode,
          campaignRepository,
          userReconciliationService,
          organizationLearnerRepository,
        });

        // then
        expect(organizationLearnerRepository.reconcileUserToOrganizationLearner).to.have.been.calledOnceWithExactly({
          userId: reconciliationInfo.id,
          organizationLearnerId: currentOrganizationLearner.id,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("And the logged account's national student id is null and the birthdays are different", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reconcile accounts', async function () {
        // given
        const currentOrganizationId = 5;
        const previousOrganizationId = 4;
        const reconciliationInfo = {
          id: 1,
          firstName: 'Guy',
          lastName: 'Tar',
          birthdate: '07/12/1996',
        };

        const campaign = domainBuilder.buildCampaign();
        const currentOrganizationLearner = domainBuilder.buildOrganizationLearner({
          id: 7,
          birthdate: '07/12/1996',
          nationalStudentId: 'INE',
          organizationId: currentOrganizationId,
        });
        const previousOrganizationLearner = domainBuilder.buildOrganizationLearner({
          id: 6,
          userId: reconciliationInfo.id,
          birthdate: '07/12/1994',
          nationalStudentId: null,
          organizationId: previousOrganizationId,
        });

        campaignRepository.getByCode.resolves(campaign);
        userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
          currentOrganizationLearner
        );
        userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
        organizationLearnerRepository.findOneByUserIdAndOrganizationId.resolves();
        organizationLearnerRepository.findByUserId.withArgs({ userId: 1 }).resolves([previousOrganizationLearner]);
        organizationLearnerRepository.reconcileUserToOrganizationLearner.resolves(currentOrganizationLearner);

        // when
        await usecases.reconcileScoOrganizationLearnerManually({
          reconciliationInfo,
          withReconciliation: true,
          campaignCode,
          campaignRepository,
          userReconciliationService,
          organizationLearnerRepository,
        });

        // then
        expect(organizationLearnerRepository.reconcileUserToOrganizationLearner).to.have.been.calledOnceWithExactly({
          userId: reconciliationInfo.id,
          organizationLearnerId: currentOrganizationLearner.id,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'And the logged account has multiple registrations with one null national student id and another with a different one',
      function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('And birthdays are different', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should throw UserShouldNotBeReconciledOnAnotherAccountError error', async function () {
            // given
            const currentOrganizationId = 5;
            const previousOrganizationId = 4;
            const reconciliationInfo = {
              id: 1,
              firstName: 'Guy',
              lastName: 'Tar',
              birthdate: '07/12/1996',
            };

            const campaign = domainBuilder.buildCampaign();
            const currentOrganizationLearner = domainBuilder.buildOrganizationLearner({
              id: 7,
              birthdate: '08/10/1980',
              nationalStudentId: 'currentINE',
              organizationId: currentOrganizationId,
            });
            const previousOrganizationLearner = domainBuilder.buildOrganizationLearner({
              id: 6,
              userId: reconciliationInfo.id,
              birthdate: '07/12/1996',
              nationalStudentId: null,
              organizationId: previousOrganizationId,
            });
            const otherOrganizationLearner = domainBuilder.buildOrganizationLearner({
              id: 9,
              userId: reconciliationInfo.id,
              birthdate: '07/12/1996',
              nationalStudentId: 'oldINE',
              organizationId: previousOrganizationId,
            });

            campaignRepository.getByCode.resolves(campaign);
            userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
              currentOrganizationLearner
            );
            userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
            organizationLearnerRepository.findOneByUserIdAndOrganizationId.resolves();
            organizationLearnerRepository.findByUserId
              .withArgs({ userId: 1 })
              .resolves([previousOrganizationLearner, otherOrganizationLearner]);

            // when
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(usecases.reconcileScoOrganizationLearnerManually)({
              reconciliationInfo,
              withReconciliation: true,
              campaignCode,
              campaignRepository,
              userReconciliationService,
              organizationLearnerRepository,
            });

            // then
            expect(error).to.be.instanceOf(UserShouldNotBeReconciledOnAnotherAccountError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('And birthdays are identical', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should reconcile accounts', async function () {
            // given
            const currentOrganizationId = 5;
            const previousOrganizationId = 4;
            const reconciliationInfo = {
              id: 1,
              firstName: 'Guy',
              lastName: 'Tar',
              birthdate: '07/12/1996',
            };

            const campaign = domainBuilder.buildCampaign();
            const currentOrganizationLearner = domainBuilder.buildOrganizationLearner({
              id: 7,
              birthdate: '07/12/1996',
              nationalStudentId: 'currentINE',
              organizationId: currentOrganizationId,
            });
            const previousOrganizationLearner = domainBuilder.buildOrganizationLearner({
              id: 6,
              userId: reconciliationInfo.id,
              birthdate: '07/12/1996',
              nationalStudentId: null,
              organizationId: previousOrganizationId,
            });
            const otherOrganizationLearner = domainBuilder.buildOrganizationLearner({
              id: 9,
              userId: reconciliationInfo.id,
              birthdate: '07/12/1996',
              nationalStudentId: 'oldINE',
              organizationId: previousOrganizationId,
            });

            campaignRepository.getByCode.resolves(campaign);
            userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
              currentOrganizationLearner
            );
            userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
            organizationLearnerRepository.findOneByUserIdAndOrganizationId.resolves();
            organizationLearnerRepository.findByUserId
              .withArgs({ userId: 1 })
              .resolves([previousOrganizationLearner, otherOrganizationLearner]);

            // when
            await usecases.reconcileScoOrganizationLearnerManually({
              reconciliationInfo,
              withReconciliation: true,
              campaignCode,
              campaignRepository,
              userReconciliationService,
              organizationLearnerRepository,
            });

            // then
            expect(organizationLearnerRepository.reconcileUserToOrganizationLearner).to.have.been.calledOnceWithExactly(
              {
                userId: reconciliationInfo.id,
                organizationLearnerId: currentOrganizationLearner.id,
              }
            );
          });
        });
      }
    );
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When one organizationLearner matched on names', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should associate user with organizationLearner', async function () {
      // given
      const withReconciliation = true;
      organizationLearner.userId = user.id;
      organizationLearner.firstName = user.firstName;
      organizationLearner.lastName = user.lastName;
      campaignRepository.getByCode
        .withArgs(campaignCode)
        .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));
      userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
        organizationLearner
      );
      userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();
      organizationLearnerRepository.reconcileUserToOrganizationLearner
        .withArgs({
          userId: user.id,
          organizationLearnerId: organizationLearnerId,
        })
        .resolves(organizationLearner);
      organizationLearnerRepository.findByUserId.resolves([organizationLearner]);

      // when
      const result = await usecases.reconcileScoOrganizationLearnerManually({
        reconciliationInfo: user,
        withReconciliation,
        campaignCode,
        campaignRepository,
        userReconciliationService,
        organizationLearnerRepository,
      });

      // then
      expect(result).to.be.instanceOf(OrganizationLearner);
      expect(result.userId).to.be.equal(user.id);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When withReconciliation is false', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not associate user with organizationLearner', async function () {
      // given
      const withReconciliation = false;
      organizationLearner.userId = user.id;
      organizationLearner.firstName = user.firstName;
      organizationLearner.lastName = user.lastName;
      campaignRepository.getByCode
        .withArgs(campaignCode)
        .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));
      userReconciliationService.findMatchingOrganizationLearnerIdForGivenOrganizationIdAndUser.resolves(
        organizationLearner
      );
      organizationLearnerRepository.findByUserId.resolves([organizationLearner]);
      userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount.resolves();

      // when
      const result = await usecases.reconcileScoOrganizationLearnerManually({
        reconciliationInfo: user,
        withReconciliation,
        campaignCode,
        campaignRepository,
        userReconciliationService,
        organizationLearnerRepository,
      });

      // then
      expect(result).to.be.undefined;
      expect(organizationLearnerRepository.reconcileUserToOrganizationLearner).to.not.have.been.called;
    });
  });
});
