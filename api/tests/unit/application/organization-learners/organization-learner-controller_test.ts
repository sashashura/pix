// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, hFake, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerController = require('../../../../lib/application/organization-learners/organization-learner-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerIdentitySerializer = require('../../../../lib/infrastructure/serializers/jsonapi/organization-learner-identity-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerUserAssociationSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/organization-learner-user-association-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Controller | organization-learner', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#dissociate', function () {
    const userId = 2;
    const organizationLearnerId = 1;
    const request = {
      auth: { credentials: { userId } },
      params: { id: organizationLearnerId },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'dissociateUserFromOrganizationLearner');
      usecases.dissociateUserFromOrganizationLearner.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-user-associations/1',
};
      const response = await organizationLearnerController.dissociate(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal('/api/organization-learners/1/association; rel="successor-version"');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/organization-learners/1/association',
};
      const response = await organizationLearnerController.dissociate(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAssociation', function () {
    const userId = 2;
    const request = {
      auth: { credentials: { userId } },
      query: {},
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'findAssociationBetweenUserAndOrganizationLearner');
      usecases.findAssociationBetweenUserAndOrganizationLearner.resolves();
      sinon.stub(organizationLearnerIdentitySerializer, 'serialize');
      organizationLearnerIdentitySerializer.serialize.resolves();
      sinon.stub(organizationLearnerUserAssociationSerializer, 'serialize');
      organizationLearnerUserAssociationSerializer.serialize.resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return information about deprecation when old route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/schooling-registration-user-associations',
};
      const response = await organizationLearnerController.findAssociation(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.equal('true');
      expect(response.headers['Link']).to.equal('/api/organization-learners; rel="successor-version"');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return information about deprecation when new route is used', async function () {
      // when
(hFake as $TSFixMe).request = {
    path: '/api/organization-learners',
};
      const response = await organizationLearnerController.findAssociation(request, hFake);

      // then
      expect(response.headers['Deprecation']).to.not.exist;
    });
  });
});
