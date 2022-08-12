// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'StudentInf... Remove this comment to see the full error message
const StudentInformationForAccountRecovery = require('../../../../lib/domain/read-models/StudentInformationForAccountRecovery');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const checkScoAccountRecovery = require('../../../../lib/domain/usecases/check-sco-account-recovery');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | check-sco-account-recovery', function () {
  let organizationLearnerRepository: $TSFixMe;
  let accountRecoveryDemandRepository: $TSFixMe;
  let userRepository: $TSFixMe;
  let organizationRepository: $TSFixMe;
  let scoAccountRecoveryService: $TSFixMe;
  const userReconciliationService = {};

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationLearnerRepository = {
      getOrganizationLearnerInformation: sinon.stub(),
      findByUserId: sinon.stub(),
    };
    userRepository = {
      get: sinon.stub(),
    };
    organizationRepository = {
      get: sinon.stub(),
    };
    scoAccountRecoveryService = {
      retrieveOrganizationLearner: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user exists', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user have only one organization learner', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user account information', async function () {
        // given
        const studentInformation = {
          ineIna: '123456789AA',
          firstName: 'Nanou',
          lastName: 'Monchose',
          birthdate: '2004-05-07',
        };

        const expectedOrganization = domainBuilder.buildOrganization({ id: 7, name: 'Lycée Poudlard' });

        scoAccountRecoveryService.retrieveOrganizationLearner
          .withArgs({
            accountRecoveryDemandRepository,
            studentInformation,
            organizationLearnerRepository,
            userRepository,
            userReconciliationService,
          })
          .resolves({
            firstName: studentInformation.firstName,
            lastName: studentInformation.lastName,
            username: 'nanou.monchose0705',
            organizationId: expectedOrganization.id,
            email: 'nanou.monchose@example.net',
          });
        organizationRepository.get.withArgs(expectedOrganization.id).resolves(expectedOrganization);

        // when
        const result = await checkScoAccountRecovery({
          userRepository,
          organizationLearnerRepository,
          studentInformation,
          organizationRepository,
          scoAccountRecoveryService,
          userReconciliationService,
        });

        // then
        const expectedResult = {
          firstName: 'Nanou',
          lastName: 'Monchose',
          username: 'nanou.monchose0705',
          email: 'nanou.monchose@example.net',
          latestOrganizationName: 'Lycée Poudlard',
        };
        expect(result).to.deep.equal(expectedResult);
        expect(result).to.be.instanceof(StudentInformationForAccountRecovery);
      });
    });
  });
});
