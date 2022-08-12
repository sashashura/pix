// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/to-be-published-session-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FinalizedS... Remove this comment to see the full error message
const FinalizedSession = require('../../../../../lib/domain/models/FinalizedSession');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | to-be-published-session-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a FinalizedSession model object into JSON API data', function () {
      // given
      const expectedJsonApi = {
        data: {
          type: 'to-be-published-sessions',
          id: '123',
          attributes: {
            'session-id': 123,
            'certification-center-name': 'A certification Center name',
            'session-date': '2017-01-20',
            'session-time': '14:30',
            'finalized-at': new Date('2020-02-17T14:23:56Z'),
          },
        },
      };

      const modelFinalizedSession = new FinalizedSession({
        sessionId: 123,
        certificationCenterName: 'A certification Center name',
        sessionDate: '2017-01-20',
        sessionTime: '14:30',
        finalizedAt: new Date('2020-02-17T14:23:56Z'),
        publishedAt: new Date('2020-02-21T14:23:56Z'),
        isToBePublished: true,
      });

      // when
      const json = serializer.serialize(modelFinalizedSession);

      // then
      expect(json).to.deep.equal(expectedJsonApi);
    });
  });
});
