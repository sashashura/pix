// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FinalizedS... Remove this comment to see the full error message
const FinalizedSession = require('../../../../../lib/domain/models/FinalizedSession');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/with-required-action-session-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | with-required-action-session-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a with-required-action-session model object into JSON API data', function () {
      // given
      const finalizedSession = new FinalizedSession({
        sessionId: 12,
        finalizedAt: new Date('2019-04-28T02:42:26Z'),
        certificationCenterName: 'Centre des Anne-Etoile',
        sessionDate: '2019-04-28',
        sessionTime: '02:42',
        isPublishable: false,
        publishedAt: null,
        assignedCertificationOfficerName: 'Anne Star',
      });

      const expectedJsonApi = {
        data: {
          type: 'with-required-action-sessions',
          id: '12',
          attributes: {
            'session-id': 12,
            'session-date': '2019-04-28',
            'session-time': '02:42',
            'finalized-at': new Date('2019-04-28T02:42:26Z'),
            'certification-center-name': 'Centre des Anne-Etoile',
            'assigned-certification-officer-name': 'Anne Star',
          },
        },
      };

      // when
      const json = serializer.serialize(finalizedSession);

      // then
      expect(json).to.deep.equal(expectedJsonApi);
    });
  });
});
