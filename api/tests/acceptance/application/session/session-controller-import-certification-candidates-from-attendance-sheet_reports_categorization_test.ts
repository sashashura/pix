// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stat'.
const { stat } = require('fs').promises;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FormData'.
const FormData = require('form-data');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'streamToPr... Remove this comment to see the full error message
const streamToPromise = require('stream-to-promise');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-import-certification-candidates-from-attendance-sheet', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/sessions/{id}/certification-candidates/import', function () {
    let user: $TSFixMe, sessionIdAllowed: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      user = databaseBuilder.factory.buildUser();
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId: user.id, certificationCenterId });

      const otherUserId = databaseBuilder.factory.buildUser().id;
      const otherCertificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      databaseBuilder.factory.buildCertificationCenterMembership({
        userId: otherUserId,
        certificationCenterId: otherCertificationCenterId,
      });

      sessionIdAllowed = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

      databaseBuilder.factory.buildCertificationCpfCountry({
        code: '99100',
        commonName: 'FRANCE',
        originalName: 'FRANCE',
        matcher: 'ACEFNR',
      });
      databaseBuilder.factory.buildCertificationCpfCountry({
        code: '99132',
        commonName: 'ANGLETERRE',
        originalName: 'ANGLETERRE',
        matcher: 'AEEEGLNRRT',
      });

      databaseBuilder.factory.buildCertificationCpfCity({ name: 'AJACCIO', INSEECode: '2A004', isActualName: true });
      databaseBuilder.factory.buildCertificationCpfCity({ name: 'PARIS 18', postalCode: '75018', isActualName: true });
      databaseBuilder.factory.buildCertificationCpfCity({
        name: 'SAINT-ANNE',
        postalCode: '97180',
        isActualName: true,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('certification-candidates').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('The user can access the session', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('The ODS file to import is valid', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('The ODS file contains regular data', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return an 204 status after success in importing the ods file', async function () {
            // given
            const odsFileName = 'files/1.5/import-certification-candidates-reports-categorization-test-ok.ods';
            // @ts-expect-error TS(2304): Cannot find name '__dirname'.
            const odsFilePath = `${__dirname}/${odsFileName}`;
            const options = await createRequest({ odsFilePath, user, sessionIdAllowed });

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(204);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context("The ODS file contains birthdate with special format ( 'DD/MM/YYYY )", function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return an 204 status after success in importing the ods file', async function () {
            // given
            const odsFileName =
              'files/1.5/import-certification-candidates-reports-categorization-test-special-birthdate-ok.ods';
            // @ts-expect-error TS(2304): Cannot find name '__dirname'.
            const odsFilePath = `${__dirname}/${odsFileName}`;
            const options = await createRequest({ odsFilePath, user, sessionIdAllowed });

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(204);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("The ODS file to extract is invalid and can't be imported", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 422 status after failing in importing the ods file', async function () {
          // given
          const odsFileName =
            'files/1.5/import-certification-candidates-reports-categorization-test-ko-invalid-file.ods';
          // @ts-expect-error TS(2304): Cannot find name '__dirname'.
          const odsFilePath = `${__dirname}/${odsFileName}`;
          const options = await createRequest({ odsFilePath, user, sessionIdAllowed });

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(422);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('The ODS file has been extracted but the data contained is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 422 status after error in data validity checker', async function () {
        // given
        const odsFileName = 'files/1.5/import-certification-candidates-reports-categorization-test-ko-invalid-data.ods';
        // @ts-expect-error TS(2304): Cannot find name '__dirname'.
        const odsFilePath = `${__dirname}/${odsFileName}`;
        const options = await createRequest({ odsFilePath, user, sessionIdAllowed });

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(422);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when at least one candidate is already linked to a user', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 400 when user cant import the candidates', async function () {
        // given
        const odsFileName = 'files/1.5/import-certification-candidates-reports-categorization-test-ok.ods';
        // @ts-expect-error TS(2304): Cannot find name '__dirname'.
        const odsFilePath = `${__dirname}/${odsFileName}`;
        const options = await createRequest({ odsFilePath, user, sessionIdAllowed });

        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCertificationCandidate({ sessionId: sessionIdAllowed, userId });
        await databaseBuilder.commit();

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});

async function createRequest({
  odsFilePath,
  user,
  sessionIdAllowed
}: $TSFixMe) {
  const form = new FormData();
  const knownLength = await stat(odsFilePath).size;
  form.append('file', fs.createReadStream(odsFilePath), { knownLength });
  const payload = await streamToPromise(form);
  const authHeader = generateValidRequestAuthorizationHeader(user.id);
  const token = authHeader.replace('Bearer ', '');
  const headers = Object.assign({}, form.getHeaders(), { authorization: `Bearer ${token}` });
  return {
    method: 'POST',
    url: `/api/sessions/${sessionIdAllowed}/certification-candidates/import`,
    headers,
    payload,
  };
}
