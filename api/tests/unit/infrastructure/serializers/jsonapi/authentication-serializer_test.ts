// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/authentication-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const Authentication = require('../../../../../lib/domain/models/Authentication');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | authentication-serializer', function () {
  const expectedJsonAnswer = {
    data: {
      id: '8',
      type: 'authentications',
      attributes: {
        'user-id': '8',
        token: 'my-token',
        password: '',
      },
    },
  };

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should format a login model object into JSON API data', function () {
      // given
      const login = new Authentication({ userId: 8, token: 'my-token' });

      // when
      const json = serializer.serialize(login);

      // then
      expect(json).to.deep.equal(expectedJsonAnswer);
    });
  });
});
