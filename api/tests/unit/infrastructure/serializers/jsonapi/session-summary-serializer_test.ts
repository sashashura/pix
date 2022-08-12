// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/session-summary-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | session-summary-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a SessionSummary model object into JSON API data', function () {
      // given
      const sessionSummary = domainBuilder.buildSessionSummary.created({
        id: 1,
        address: 'ici',
        room: 'la-bas',
        date: '2020-01-01',
        time: '16:00',
        examiner: 'Moi',
        enrolledCandidatesCount: 5,
        effectiveCandidatesCount: 4,
      });

      // when
      const json = serializer.serialize(sessionSummary);

      // then
      expect(json).to.deep.equal({
        data: {
          type: 'session-summaries',
          id: '1',
          attributes: {
            address: 'ici',
            room: 'la-bas',
            date: '2020-01-01',
            time: '16:00',
            examiner: 'Moi',
            status: 'created',
            'enrolled-candidates-count': 5,
            'effective-candidates-count': 4,
          },
        },
      });
    });
  });
});
