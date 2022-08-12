// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { generateUsername } = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Student'.
const Student = require('../../../../lib/domain/models/Student');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerNotFound,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerAlreadyLinkedToUserError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | generate-username', function () {
  const organizationId = 1;
  const organizationLearnerId = 1;

  let campaignRepository: $TSFixMe;
  let userRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;
  let studentRepository: $TSFixMe;

  let obfuscationService: $TSFixMe;
  let userReconciliationService: $TSFixMe;

  let campaignCode: $TSFixMe;
  let studentInformation: $TSFixMe;
  let organizationLearner: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignCode = 'RESTRICTD';

    organizationLearner = domainBuilder.buildOrganizationLearner({ organizationId, id: organizationLearnerId });
    studentInformation = {
      id: 1,
      firstName: 'Joe',
      lastName: 'Poe',
      birthdate: '1992-02-02',
    };

    campaignRepository = {
      getByCode: sinon.stub(),
    };
    userRepository = {
      getForObfuscation: sinon.stub(),
    };
    organizationLearnerRepository = {
      findByOrganizationIdAndBirthdate: sinon.stub(),
    };
    studentRepository = {
      getReconciledStudentByNationalStudentId: sinon.stub(),
    };
    obfuscationService = {
      getUserAuthenticationMethodWithObfuscation: sinon.stub(),
    };
    userReconciliationService = {
      findMatchingCandidateIdForGivenUser: sinon.stub(),
      createUsernameByUser: sinon.stub(),
    };

    campaignRepository.getByCode
      .withArgs(campaignCode)
      .resolves(domainBuilder.buildCampaign({ organization: { id: organizationId } }));
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When there is no campaign with the given code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a campaign code error', async function () {
      // given
      campaignRepository.getByCode.withArgs(campaignCode).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(generateUsername)({
        studentInformation,
        campaignCode,
        campaignRepository,
        organizationLearnerRepository,
        userReconciliationService,
        obfuscationService,
        userRepository,
        studentRepository,
      });

      // then
      expect(result).to.be.instanceof(CampaignCodeError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner found matching organization and birthdate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a OrganizationLearnerNotFound error', async function () {
      // given
      organizationLearnerRepository.findByOrganizationIdAndBirthdate.resolves([]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(generateUsername)({
        studentInformation,
        campaignCode,
        campaignRepository,
        organizationLearnerRepository,
        userReconciliationService,
        obfuscationService,
        userRepository,
        studentRepository,
      });

      // then
      expect(result).to.be.instanceof(OrganizationLearnerNotFound);
      expect((result as $TSFixMe).message).to.equal('There were no organizationLearners matching with organization and birthdate');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When no organizationLearner found matching with firstname and lastname', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a OrganizationLearnerNotFound error', async function () {
      // given
      organizationLearnerRepository.findByOrganizationIdAndBirthdate.resolves([organizationLearner]);
      userReconciliationService.findMatchingCandidateIdForGivenUser
        .withArgs([organizationLearner], studentInformation)
        .resolves();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(generateUsername)({
        studentInformation,
        campaignCode,
        campaignRepository,
        organizationLearnerRepository,
        userReconciliationService,
        obfuscationService,
        userRepository,
        studentRepository,
      });

      // then
      expect(result).to.be.instanceof(OrganizationLearnerNotFound);
      expect((result as $TSFixMe).message).to.equal('There were no organizationLearners matching with names');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When student is already reconciled in the same organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a OrganizationLearnerAlreadyLinkedToUser error', async function () {
      // given
      organizationLearner.userId = studentInformation.id;
      organizationLearner.firstName = studentInformation.firstName;
      organizationLearner.lastName = studentInformation.lastName;
      const exceptedErrorMessage = 'Un compte existe déjà pour l‘élève dans le même établissement.';

      organizationLearnerRepository.findByOrganizationIdAndBirthdate.resolves([organizationLearner]);
      userReconciliationService.findMatchingCandidateIdForGivenUser.resolves(organizationLearner.id);
      userRepository.getForObfuscation.resolves();
      obfuscationService.getUserAuthenticationMethodWithObfuscation.resolves({
        authenticatedBy: 'email',
        value: 'e***@example.net',
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(generateUsername)({
        studentInformation,
        campaignCode,
        campaignRepository,
        organizationLearnerRepository,
        userReconciliationService,
        obfuscationService,
        userRepository,
        studentRepository,
      });

      // then
      expect(result).to.be.instanceof(OrganizationLearnerAlreadyLinkedToUserError);
      expect((result as $TSFixMe).message).to.equal(exceptedErrorMessage);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When student is already reconciled in others organizations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a OrganizationLearnerAlreadyLinkedToUser error', async function () {
      // given
      organizationLearner.firstName = studentInformation.firstName;
      organizationLearner.lastName = studentInformation.lastName;
      const exceptedErrorMessage = 'Un compte existe déjà pour l‘élève dans un autre établissement.';
      organizationLearnerRepository.findByOrganizationIdAndBirthdate.resolves([organizationLearner]);
      userReconciliationService.findMatchingCandidateIdForGivenUser.resolves(organizationLearner.id);
      const student = new Student({ account: { userId: studentInformation.id } });
      studentRepository.getReconciledStudentByNationalStudentId.resolves(student);
      userRepository.getForObfuscation.resolves();
      obfuscationService.getUserAuthenticationMethodWithObfuscation.resolves({
        authenticatedBy: 'email',
        value: 'e***@example.net',
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(generateUsername)({
        studentInformation,
        campaignCode,
        campaignRepository,
        organizationLearnerRepository,
        userReconciliationService,
        obfuscationService,
        userRepository,
        studentRepository,
      });

      // then
      expect(result).to.be.instanceof(OrganizationLearnerAlreadyLinkedToUserError);
      expect((result as $TSFixMe).message).to.equal(exceptedErrorMessage);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When organizationLearner matched and student is not already reconciled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call createUsernameByUser with student information from database', async function () {
      // given
      organizationLearnerRepository.findByOrganizationIdAndBirthdate.resolves([organizationLearner]);
      userReconciliationService.findMatchingCandidateIdForGivenUser.resolves(organizationLearner.id);

      studentInformation = {
        firstName: organizationLearner.firstName,
        lastName: organizationLearner.lastName,
        birthdate: organizationLearner.birthdate,
      };

      // when
      await generateUsername({
        studentInformation,
        campaignCode,
        campaignRepository,
        organizationLearnerRepository,
        userReconciliationService,
        obfuscationService,
        userRepository,
        studentRepository,
      });

      // then
      expect(userReconciliationService.createUsernameByUser).calledWith({ user: studentInformation, userRepository });
    });
  });
});
