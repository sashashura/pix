const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-get-jury-session', function () {
  let server: $TSFixMe, options: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    await insertUserWithRoleSuperAdmin();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/sessions/{id}', function () {
    let expectedJurySession;
    let certificationCenter;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const assignedCertificationOfficerId = databaseBuilder.factory.buildUser({
        id: 100002,
        firstName: 'Pix',
        lastName: 'Doe',
      }).id;
      certificationCenter = databaseBuilder.factory.buildCertificationCenter({
        id: 100003,
        type: 'SCO',
        externalId: 'EXT_ID',
      });
      expectedJurySession = databaseBuilder.factory.buildSession({
        id: 100004,
        assignedCertificationOfficerId,
        certificationCenterId: certificationCenter.id,
        certificationCenter: certificationCenter.name,
      });
      databaseBuilder.factory.buildSupervisorAccess({ sessionId: expectedJurySession.id });
      databaseBuilder.factory.buildSession({ id: 1000099 });
      options = {
        method: 'GET',
        url: `/api/admin/sessions/${expectedJurySession.id}`,
      };
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is Super Admin', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options.headers = { authorization: generateValidRequestAuthorizationHeader() };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 200 status code response with JSON API serialized', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          included: [{ type: 'user', id: '100002', attributes: { 'first-name': 'Pix', 'last-name': 'Doe' } }],
          data: {
            type: 'sessions',
            id: '100004',
            attributes: {
              'certification-center-name': 'some name',
              'certification-center-type': 'SCO',
              'certification-center-id': 100003,
              'certification-center-external-id': 'EXT_ID',
              address: '3 rue des églantines',
              room: 'B315',
              examiner: 'Ginette',
              date: '2020-01-15',
              time: '15:30:00',
              'access-code': 'FMKP39',
              status: 'in_process',
              description: 'La session se déroule dans le jardin',
              'examiner-global-comment': '',
              'finalized-at': null,
              'results-sent-to-prescriber-at': null,
              'published-at': null,
              'jury-comment': null,
              'jury-commented-at': null,
              'has-supervisor-access': true,
              'has-joining-issue': false,
              'has-incident': false,
            },
            relationships: {
              'assigned-certification-officer': { data: { type: 'user', id: '100002' } },
              'jury-comment-author': { data: null },
              'jury-certification-summaries': {
                links: { related: '/api/admin/sessions/100004/jury-certification-summaries' },
              },
            },
          },
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not SuperAdmin', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options.headers = { authorization: generateValidRequestAuthorizationHeader(1111) };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 403 HTTP status code ', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not connected', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401 HTTP status code if user is not authenticated', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
