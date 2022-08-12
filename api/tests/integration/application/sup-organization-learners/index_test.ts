// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer, generateValidRequestAuthorizationHeader } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerController = require('../../../../lib/application/sup-organization-learners/sup-organization-learner-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/sup-organization-learners');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Route | sup-organization-learners', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon
      .stub(supOrganizationLearnerController, 'reconcileSupOrganizationLearner')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
    sinon
      .stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
    sinon.stub(supOrganizationLearnerController, 'updateStudentNumber').returns('ok');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/schooling-registration-user-associations/student', function () {
    const method = 'POST';
    const url = '/api/schooling-registration-user-associations/student';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('User association with studentNumber, firstName, lastName, birthdate and campaignCode', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // given
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed when there is a space', async function () {
        // given
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001 ',
              'first-name': 'Robert ',
              'last-name': 'Smith ',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(204);
        expect(response.request.payload.data.attributes['first-name']).to.equal('Robert ');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is no payload', async function () {
        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid student number attribute in the payload', async function () {
        // given
        const INVALID_STUDENT_NUMBER = ' ';
        const payload = {
          data: {
            attributes: {
              'student-number': INVALID_STUDENT_NUMBER,
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid first name attribute in the payload', async function () {
        // given
        const INVALID_FIRSTNAME = ' ';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': INVALID_FIRSTNAME,
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid last name attribute in the payload', async function () {
        // given
        const INVALID_LASTNAME = '';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': INVALID_LASTNAME,
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid a birthdate attribute (with space) in the payload', async function () {
        // given
        const INVALID_BIRTHDATE = '2012- 12-12';

        // when
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: INVALID_BIRTHDATE,
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid birthdate attribute (with extra zeros) in the payload', async function () {
        // given
        const INVALID_BIRTHDATE = '2012-012-12';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: INVALID_BIRTHDATE,
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid birthdate attribute (not a proper date) in the payload', async function () {
        // given
        const INVALID_BIRTHDATE = '1999-99-99';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: INVALID_BIRTHDATE,
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid campaign code attribute in the payload', async function () {
        // given
        const INVALID_CAMPAIGNCODE = '';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': INVALID_CAMPAIGNCODE,
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/sup-organization-learners/association', function () {
    const method = 'POST';
    const url = '/api/sup-organization-learners/association';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('User association with studentNumber, firstName, lastName, birthdate and campaignCode', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed', async function () {
        // given
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(204);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should succeed when there is a space', async function () {
        // given
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001 ',
              'first-name': 'Robert ',
              'last-name': 'Smith ',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(204);
        expect(response.request.payload.data.attributes['first-name']).to.equal('Robert ');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is no payload', async function () {
        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid student number attribute in the payload', async function () {
        // given
        const INVALID_STUDENT_NUMBER = ' ';
        const payload = {
          data: {
            attributes: {
              'student-number': INVALID_STUDENT_NUMBER,
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid first name attribute in the payload', async function () {
        // given
        const INVALID_FIRSTNAME = ' ';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': INVALID_FIRSTNAME,
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid last name attribute in the payload', async function () {
        // given
        const INVALID_LASTNAME = '';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': INVALID_LASTNAME,
              birthdate: '2012-12-12',
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid a birthdate attribute (with space) in the payload', async function () {
        // given
        const INVALID_BIRTHDATE = '2012- 12-12';

        // when
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: INVALID_BIRTHDATE,
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid birthdate attribute (with extra zeros) in the payload', async function () {
        // given
        const INVALID_BIRTHDATE = '2012-012-12';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: INVALID_BIRTHDATE,
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid birthdate attribute (not a proper date) in the payload', async function () {
        // given
        const INVALID_BIRTHDATE = '1999-99-99';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: INVALID_BIRTHDATE,
              'campaign-code': 'RESTRICTD',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when there is an invalid campaign code attribute in the payload', async function () {
        // given
        const INVALID_CAMPAIGNCODE = '';
        const payload = {
          data: {
            attributes: {
              'student-number': 'F001',
              'first-name': 'Robert',
              'last-name': 'Smith',
              birthdate: '2012-12-12',
              'campaign-code': INVALID_CAMPAIGNCODE,
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload);

        // then
        expect(response.statusCode).to.equal(422);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/organizations/id/schooling-registration-user-associations/schoolingRegistrationId', function () {
    const method = 'PATCH';
    const organizationId = 2;
    const organizationLearnerId = '1234';
    const userId = 2;
    let headers: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      headers = {
        authorization: generateValidRequestAuthorizationHeader(userId),
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should exist', async function () {
        // given
        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };
        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 422 status error when student-number parameter is not a string', async function () {
        // given
        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': 1234,
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(422);
        expect(responsePayload.errors[0].title).to.equal('Unprocessable entity');
        expect(responsePayload.errors[0].detail).to.equal('Un des champs saisis n’est pas valide.');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 404 status error when organizationId parameter is not a number', async function () {
        // given
        const url = `/api/organizations/FAKE_ORGANIZATION_ID/schooling-registration-user-associations/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(404);
        expect(responsePayload.errors[0].title).to.equal('Not Found');
        expect(responsePayload.errors[0].detail).to.equal('Ressource non trouvée');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 404 status error when studentId parameter is not a number', async function () {
        // given
        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/FAKE_STUDENT_ID`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(404);
        expect(responsePayload.errors[0].title).to.equal('Not Found');
        expect(responsePayload.errors[0].detail).to.equal('Ressource non trouvée');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when the user is not authenticated', async function () {
        // given
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
          h.response().code(403).takeover()
        );
        const url = `/api/organizations/${organizationId}/schooling-registration-user-associations/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/organizations/id/sup-organization-learners/organizationLearnerId', function () {
    const method = 'PATCH';
    const organizationId = 2;
    const organizationLearnerId = '1234';
    const userId = 2;
    let headers: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      headers = {
        authorization: generateValidRequestAuthorizationHeader(userId),
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should exist', async function () {
        // given
        const url = `/api/organizations/${organizationId}/sup-organization-learners/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };
        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 422 status error when student-number parameter is not a string', async function () {
        // given
        const url = `/api/organizations/${organizationId}/sup-organization-learners/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': 1234,
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(422);
        expect(responsePayload.errors[0].title).to.equal('Unprocessable entity');
        expect(responsePayload.errors[0].detail).to.equal('Un des champs saisis n’est pas valide.');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 404 status error when organizationId parameter is not a number', async function () {
        // given
        const url = `/api/organizations/FAKE_ORGANIZATION_ID/sup-organization-learners/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(404);
        expect(responsePayload.errors[0].title).to.equal('Not Found');
        expect(responsePayload.errors[0].detail).to.equal('Ressource non trouvée');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 404 status error when studentId parameter is not a number', async function () {
        // given
        const url = `/api/organizations/${organizationId}/sup-organization-learners/FAKE_STUDENT_ID`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        const responsePayload = JSON.parse(response.payload);
        expect(response.statusCode).to.equal(404);
        expect(responsePayload.errors[0].title).to.equal('Not Found');
        expect(responsePayload.errors[0].detail).to.equal('Ressource non trouvée');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error when the user is not authenticated', async function () {
        // given
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.callsFake((request: $TSFixMe, h: $TSFixMe) =>
          h.response().code(403).takeover()
        );
        const url = `/api/organizations/${organizationId}/sup-organization-learners/${organizationLearnerId}`;
        const payload = {
          data: {
            attributes: {
              'student-number': '1234',
            },
          },
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
