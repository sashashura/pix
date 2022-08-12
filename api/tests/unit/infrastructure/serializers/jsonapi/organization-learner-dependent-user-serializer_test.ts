// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/organization-learner-dependent-user-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | organization-learner-dependent-user-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a organization-learner-dependent-user object into JSON API data', function () {
      // given
      const organizationLearnerWithUsernameAndPassword = domainBuilder.buildOrganizationLearner();
      organizationLearnerWithUsernameAndPassword.username = 'john.harry0702';
      organizationLearnerWithUsernameAndPassword.generatedPassword = 'AZFETGFR';

      const expectedOrganizationLearnerJson = {
        data: {
          type: 'schooling-registration-dependent-users',
          id: organizationLearnerWithUsernameAndPassword.id.toString(),
          attributes: {
            username: 'john.harry0702',
            'generated-password': 'AZFETGFR',
          },
        },
      };

      // when
      const json = serializer.serialize(organizationLearnerWithUsernameAndPassword);

      // then
      expect(json).to.deep.equal(expectedOrganizationLearnerJson);
    });
  });
});
