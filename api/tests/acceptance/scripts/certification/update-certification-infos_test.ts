// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'writeFile'... Remove this comment to see the full error message
const { writeFile, rm } = require('fs/promises');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'values'.
const values = require('lodash/values');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateCert... Remove this comment to see the full error message
const { updateCertificationInfos, headers } = require('../../../../scripts/certification/update-certification-infos');
// @ts-expect-error TS(2304): Cannot find name '__dirname'.
const dataFile = `${__dirname}/data.csv`;
// @ts-expect-error TS(2304): Cannot find name '__dirname'.
const sessionIdsFile = `${__dirname}/sessionIds.csv`;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Scripts | update-certification-infos', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateCertificationInfos', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      try {
        await rm(dataFile);
      } finally {
        await rm(sessionIdsFile);
      }
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update course and candidate by external id', async function () {
      // given
      const session = databaseBuilder.factory.buildSession();
      const user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildCertificationCourse({
        id: 5,
        externalId: '123',
        userId: user.id,
        sessionId: session.id,
      });
      databaseBuilder.factory.buildCertificationCandidate({
        id: 50,
        externalId: '123',
        userId: user.id,
      });

      await databaseBuilder.commit();

      await _createDataFile(dataFile, [
        {
          externalId: '123',
          birthdate: '2000-12-31',
          birthINSEECode: 'inseeUPDATED123',
          birthPostalCode: 'postalUPDATED123',
          birthCity: 'cityUPDATED123',
          birthCountry: 'countryUPDATED123',
        },
      ]);
      await _createSessionIdsFile(sessionIdsFile, 1, session.id);

      await updateCertificationInfos(dataFile, sessionIdsFile);
      const certificationCandidates = await _getCertificationCandidates();

      // when
      const certificationCourses = await _getCertificationCourses();

      // then
      expect(certificationCourses).to.deep.equal([
        {
          id: 5,
          externalId: '123',
          birthdate: '2000-12-31',
          birthINSEECode: 'inseeUPDATED123',
          birthPostalCode: 'postalUPDATED123',
          birthplace: 'cityUPDATED123',
          birthCountry: 'countryUPDATED123',
        },
      ]);
      expect(certificationCandidates).to.deep.equal([
        {
          id: 50,
          externalId: '123',
          birthdate: '2000-12-31',
          birthINSEECode: 'inseeUPDATED123',
          birthPostalCode: 'postalUPDATED123',
          birthCity: 'cityUPDATED123',
          birthCountry: 'countryUPDATED123',
        },
      ]);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no certification course for the candidate', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not update candidate', async function () {
        // given
        databaseBuilder.factory.buildCertificationCandidate({
          id: 52,
          externalId: '123',
          userId: null,
          birthdate: '2000-01-01',
          birthINSEECode: 'y',
          birthPostalCode: 'y',
          birthCity: 'y',
          birthCountry: 'y',
        });

        await databaseBuilder.commit();

        await _createSessionIdsFile(sessionIdsFile, 1);
        await _createDataFile(dataFile, [
          {
            externalId: '123',
            birthdate: '2000-12-31',
            birthINSEECode: 'inseeUPDATED123',
            birthPostalCode: 'postalUPDATED123',
            birthCity: 'cityUPDATED123',
            birthCountry: 'countryUPDATED123',
          },
        ]);

        // when
        await updateCertificationInfos(dataFile, sessionIdsFile);
        const certificationCandidates = await _getCertificationCandidates();

        // then
        expect(certificationCandidates.find(({
          id
        }: $TSFixMe) => id === 52)).to.deep.equal({
          id: 52,
          externalId: '123',
          birthdate: '2000-01-01',
          birthINSEECode: 'y',
          birthPostalCode: 'y',
          birthCity: 'y',
          birthCountry: 'y',
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should log a warning', async function () {
        // given
        sinon.stub(logger, 'warn');
        await _createSessionIdsFile(sessionIdsFile, 1);
        await _createDataFile(dataFile, [
          {
            externalId: '123',
            birthdate: '2000-12-31',
            birthINSEECode: 'inseeUPDATED123',
            birthPostalCode: 'postalUPDATED123',
            birthCity: 'cityUPDATED123',
            birthCountry: 'countryUPDATED123',
          },
        ]);

        // when
        await updateCertificationInfos(dataFile, sessionIdsFile);

        // then
        expect(logger.warn).to.have.been.calledWith('Certification for external id 123 not found');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification course is from another session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not update candidate', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        const session = databaseBuilder.factory.buildSession();
        const otherSession = databaseBuilder.factory.buildSession();
        databaseBuilder.factory.buildCertificationCourse({
          id: 5,
          externalId: '123',
          userId: user.id,
          sessionId: otherSession.id,
          birthdate: '2000-01-01',
          birthINSEECode: 'y',
          birthPostalCode: 'y',
          birthplace: 'y',
          birthCountry: 'y',
        });
        databaseBuilder.factory.buildCertificationCandidate({
          id: 52,
          externalId: '123',
          userId: user.id,
          birthdate: '2000-01-01',
          birthINSEECode: 'y',
          birthPostalCode: 'y',
          birthCity: 'y',
          birthCountry: 'y',
        });

        await databaseBuilder.commit();
        await _createSessionIdsFile(sessionIdsFile, session.id);
        await _createDataFile(dataFile, [
          {
            externalId: '123',
            birthdate: '2000-12-31',
            birthINSEECode: 'inseeUPDATED123',
            birthPostalCode: 'postalUPDATED123',
            birthCity: 'cityUPDATED123',
            birthCountry: 'countryUPDATED123',
          },
        ]);

        // when
        await updateCertificationInfos(dataFile, sessionIdsFile);
        const certificationCandidates = await _getCertificationCandidates();
        const certificationCourses = await _getCertificationCourses();

        // then
        expect(certificationCandidates).to.deep.equal([
          {
            id: 52,
            externalId: '123',
            birthdate: '2000-01-01',
            birthINSEECode: 'y',
            birthPostalCode: 'y',
            birthCity: 'y',
            birthCountry: 'y',
          },
        ]);
        expect(certificationCourses).to.deep.equal([
          {
            id: 5,
            externalId: '123',
            birthdate: '2000-01-01',
            birthINSEECode: 'y',
            birthPostalCode: 'y',
            birthplace: 'y',
            birthCountry: 'y',
          },
        ]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should log a warning', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        const session = databaseBuilder.factory.buildSession();
        databaseBuilder.factory.buildCertificationCourse({
          id: 5,
          externalId: '123',
          userId: user.id,
          sessionId: session.id,
        });
        await databaseBuilder.commit();
        sinon.stub(logger, 'warn');
        await _createSessionIdsFile(sessionIdsFile, 1);
        await _createDataFile(dataFile, [
          {
            externalId: '123',
            birthdate: '2000-12-31',
            birthINSEECode: 'inseeUPDATED123',
            birthPostalCode: 'postalUPDATED123',
            birthCity: 'cityUPDATED123',
            birthCountry: 'countryUPDATED123',
          },
        ]);

        // when
        await updateCertificationInfos(dataFile, sessionIdsFile);

        // then
        expect(logger.warn).to.have.been.calledWith('Certification for external id 123 not found');
      });
    });
  });
});

function _getCertificationCandidates() {
  return knex
    .select('id', 'birthdate', 'birthCity', 'birthPostalCode', 'birthINSEECode', 'birthCountry', 'externalId')
    .from('certification-candidates');
}

function _getCertificationCourses() {
  return knex
    .select('id', 'birthdate', 'birthplace', 'birthPostalCode', 'birthINSEECode', 'birthCountry', 'externalId')
    .from('certification-courses');
}

async function _createDataFile(dataFile: $TSFixMe, data: $TSFixMe) {
  return writeFile(dataFile, [values(headers).join(',')].concat(data.map((line: $TSFixMe) => values(line))).join('\n'));
}

async function _createSessionIdsFile(dataFile: $TSFixMe, ...ids: $TSFixMe[]) {
  return writeFile(dataFile, ids.join(','));
}
