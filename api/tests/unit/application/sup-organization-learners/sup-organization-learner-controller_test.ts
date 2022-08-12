// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, hFake, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerController = require('../../../../lib/application/sup-organization-learners/sup-organization-learner-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Controller | sup-organization-learner', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#reconcileSupOrganizationLearner', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'reconcileSupOrganizationLearner');
      usecases.reconcileSupOrganizationLearner.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-user-associations/student',
};
      const response = await supOrganizationLearnerController.reconcileSupOrganizationLearner(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal('/api/sup-organization-learners/association; rel="successor-version"');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/sup-organization-learners/association',
};
      const response = await supOrganizationLearnerController.reconcileSupOrganizationLearner(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateStudentNumber', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      params: { id: 1, schoolingRegistrationId: 2, organizationLearnerId: 2 },
      payload: { data: { attributes: {} } },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'updateStudentNumber');
      usecases.updateStudentNumber.resolves();
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
      securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/organizations/1/schooling-registration-user-associations/2',
};
      const response = await supOrganizationLearnerController.updateStudentNumber(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal(
        '/api/organizations/1/sup-organization-learners/2; rel="successor-version"'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/organizations/1/sup-organization-learners/2',
};
      const response = await supOrganizationLearnerController.updateStudentNumber(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });
});
