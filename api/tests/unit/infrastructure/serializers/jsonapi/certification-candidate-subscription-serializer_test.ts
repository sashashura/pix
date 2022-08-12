// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-candidate-subscription-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-candidate-subscription-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized JSON data object', function () {
      const certificationCandidateSubscription = domainBuilder.buildCertificationCandidateSubscription({
        id: 123,
        sessionId: 456,
        eligibleSubscriptions: [
          domainBuilder.buildComplementaryCertification({
            key: 'FIRST_COMPLEMENTARY',
            label: 'First Complementary Certification',
          }),
        ],
        nonEligibleSubscriptions: [
          domainBuilder.buildComplementaryCertification({
            key: 'SECOND_COMPLEMENTARY',
            label: 'Second Complementary Certification',
          }),
        ],
      });

      const expectedSerializedResult = {
        data: {
          id: '123',
          type: 'certification-candidate-subscriptions',
          attributes: {
            'eligible-subscriptions': [
              {
                id: 1,
                key: 'FIRST_COMPLEMENTARY',
                label: 'First Complementary Certification',
              },
            ],
            'non-eligible-subscriptions': [
              {
                id: 1,
                key: 'SECOND_COMPLEMENTARY',
                label: 'Second Complementary Certification',
              },
            ],
            'session-id': 456,
          },
        },
      };

      // when
      const result = serializer.serialize(certificationCandidateSubscription);

      // then
      expect(result).to.deep.equal(expectedSerializedResult);
    });
  });
});
