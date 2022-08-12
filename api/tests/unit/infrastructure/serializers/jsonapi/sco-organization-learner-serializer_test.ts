// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/sco-organization-learner-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../../lib/domain/models/OrganizationLearner');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | sco-organization-learner-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serializeIdentity', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert an organizationLearner model object into JSON API data', function () {
      // given
      const organizationLearner = new OrganizationLearner({
        id: 5,
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '2020-01-01',
      });

      const expectedSerializedOrganizationLearner = {
        data: {
          type: 'sco-organization-learners',
          id: '5',
          attributes: {
            'first-name': organizationLearner.firstName,
            'last-name': organizationLearner.lastName,
            birthdate: organizationLearner.birthdate,
          },
        },
      };

      // when
      const json = serializer.serializeIdentity(organizationLearner);

      // then
      expect(json).to.deep.equal(expectedSerializedOrganizationLearner);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serializeWithUsernameGeneration', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert into JSON API data', function () {
      // given
      const organizationLearner = {
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '2020-01-01',
        username: 'john.doe0101',
      };

      const expectedSerializedOrganizationLearner = {
        data: {
          type: 'sco-organization-learners',
          attributes: {
            'first-name': organizationLearner.firstName,
            'last-name': organizationLearner.lastName,
            birthdate: organizationLearner.birthdate,
            username: organizationLearner.username,
          },
        },
      };

      // when
      const json = serializer.serializeWithUsernameGeneration(organizationLearner);

      // then
      expect(json).to.deep.equal(expectedSerializedOrganizationLearner);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serializeExternal', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert into JSON API data', function () {
      // given
      const organizationLearner = {
        accessToken: 'some token',
      };

      const expectedSerializedOrganizationLearner = {
        data: {
          attributes: {
            'access-token': organizationLearner.accessToken,
          },
          type: 'external-users',
        },
      };

      // when
      const json = serializer.serializeExternal(organizationLearner);

      // then
      expect(json).to.deep.equal(expectedSerializedOrganizationLearner);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serializeCredentialsForDependent', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert into JSON API data', function () {
      // given
      const organizationLearner = {
        generatedPassword: 'generated passw0rd',
        username: 'us3rnam3',
      };

      const expectedSerializedOrganizationLearner = {
        data: {
          attributes: {
            'generated-password': organizationLearner.generatedPassword,
            username: organizationLearner.username,
          },
          type: 'dependent-users',
        },
      };

      // when
      const json = serializer.serializeCredentialsForDependent(organizationLearner);

      // then
      expect(json).to.deep.equal(expectedSerializedOrganizationLearner);
    });
  });
});
