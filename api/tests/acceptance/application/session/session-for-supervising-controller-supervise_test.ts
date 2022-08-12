const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
  domainBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-for-supervising-controller-supervise', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('supervisor-accesses').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return a HTTP 204 No Content', async function () {
    // given

    const certificationCenter = databaseBuilder.factory.buildCertificationCenter({ isSupervisorAccessEnabled: true });
    const session = domainBuilder.buildSession({ id: 121, certificationCenterId: certificationCenter.id });
    session.generateSupervisorPassword();
    const supervisorPassword = session.supervisorPassword;
    databaseBuilder.factory.buildUser({ id: 3456 });
    databaseBuilder.factory.buildSession(session);
    await databaseBuilder.commit();

    const headers = { authorization: generateValidRequestAuthorizationHeader(3456, 'pix-certif') };

    const options = {
      headers,
      method: 'POST',
      url: '/api/sessions/supervise',
      payload: {
        data: {
          id: '1234',
          type: 'supervisor-authentications',
          attributes: {
            'session-id': '121',
            'supervisor-password': supervisorPassword,
          },
        },
      },
    };

    // when
    const response = await server.inject(options);

    // then
    const supervisedSessionInDB = await knex('supervisor-accesses').where({ userId: 3456, sessionId: 121 }).first();
    expect(supervisedSessionInDB).to.exist;
    expect(response.statusCode).to.equal(204);
  });
});
