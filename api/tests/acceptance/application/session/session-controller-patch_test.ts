// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-patch', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/sessions/{id}', function () {
    let user: $TSFixMe, unauthorizedUser: $TSFixMe, certificationCenter, session: $TSFixMe, payload: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      user = databaseBuilder.factory.buildUser();
      unauthorizedUser = databaseBuilder.factory.buildUser();
      certificationCenter = databaseBuilder.factory.buildCertificationCenter();
      databaseBuilder.factory.buildCertificationCenterMembership({
        userId: user.id,
        certificationCenterId: certificationCenter.id,
      });
      session = databaseBuilder.factory.buildSession({
        certificationCenter: certificationCenter.name,
        certificationCenterId: certificationCenter.id,
        address: 'Nice',
        room: '28D',
        examiner: 'Antoine Toutvenant',
        date: '2017-12-08',
        time: '14:30',
        description: 'ahah',
        accessCode: 'ABCD12',
      });
      databaseBuilder.factory.buildCertificationCourse({
        sessionId: session.id,
      });
      payload = {
        data: {
          id: session.id,
          type: 'sessions',
          attributes: {
            address: 'New address',
            room: 'New room',
            examiner: 'Antoine Toutvenant',
            date: '2017-08-12',
            time: '14:30',
            description: 'ahah',
            accessCode: 'ABCD12',
          },
        },
      };

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with a 200 and update the session', function () {
      const options = {
        method: 'PATCH',
        url: `/api/sessions/${session.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        payload,
      };

      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.type).to.equal('sessions');
        expect(response.result.data.id).to.equal(session.id.toString());
        expect(response.result.data.attributes.address).to.equal('New address');
        expect(response.result.data.attributes.room).to.equal('New room');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should respond with a 404 when user is not authorized to update the session (to keep opacity on whether forbidden or not found)', function () {
      const options = {
        method: 'PATCH',
        url: `/api/sessions/${session.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(unauthorizedUser.id) },
        payload,
      };

      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(404);
      });
    });
  });
});
