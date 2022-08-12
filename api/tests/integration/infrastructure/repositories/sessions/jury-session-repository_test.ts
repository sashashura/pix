// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, catchErr, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JurySessio... Remove this comment to see the full error message
const JurySession = require('../../../../../lib/domain/models/JurySession');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('../../../../../lib/domain/models/JurySession');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationOfficer = require('../../../../../lib/domain/models/CertificationOfficer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jurySessio... Remove this comment to see the full error message
const jurySessionRepository = require('../../../../../lib/infrastructure/repositories/sessions/jury-session-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | JurySession', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id of session exists', function () {
      let sessionId: $TSFixMe;
      let certificationCenterId: $TSFixMe;
      let assignedCertificationOfficer: $TSFixMe;
      let juryCommentAuthor: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        assignedCertificationOfficer = databaseBuilder.factory.buildUser({
          firstName: 'Pix',
          lastName: 'Doe',
        });
        juryCommentAuthor = databaseBuilder.factory.buildUser({
          firstName: 'Lili',
          lastName: 'Raton',
        });
        certificationCenterId = databaseBuilder.factory.buildCertificationCenter({ externalId: 'EXT_ID' }).id;
        sessionId = databaseBuilder.factory.buildSession({
          accessCode: 'GHKM26',
          assignedCertificationOfficerId: assignedCertificationOfficer.id,
          certificationCenterId,
          juryComment: 'Les mecs ils font des sessions de certif dans le jardin ??',
          juryCommentAuthorId: juryCommentAuthor.id,
          juryCommentedAt: new Date('2020-02-28T14:30:25Z'),
          hasIncident: true,
          hasJoiningIssue: true,
        }).id;

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the session', async function () {
        // given
        const expectedJurySession = domainBuilder.buildJurySession({
          id: sessionId,
          certificationCenterName: 'Centre de certif Pix',
          certificationCenterType: 'SUP',
          certificationCenterId: certificationCenterId,
          certificationCenterExternalId: 'EXT_ID',
          address: '3 rue des églantines',
          room: 'B315',
          examiner: 'Ginette',
          date: '2020-01-15',
          time: '15:30:00',
          accessCode: 'GHKM26',
          description: 'La session se déroule dans le jardin',
          examinerGlobalComment: '',
          hasIncident: true,
          hasJoiningIssue: true,
          finalizedAt: null,
          resultsSentToPrescriberAt: null,
          publishedAt: null,
          juryComment: 'Les mecs ils font des sessions de certif dans le jardin ??',
          juryCommentAuthorId: juryCommentAuthor.id,
          juryCommentedAt: new Date('2020-02-28T14:30:25Z'),
          assignedCertificationOfficer: {
            id: assignedCertificationOfficer.id,
            firstName: assignedCertificationOfficer.firstName,
            lastName: assignedCertificationOfficer.lastName,
          },
          juryCommentAuthor: {
            id: juryCommentAuthor.id,
            firstName: juryCommentAuthor.firstName,
            lastName: juryCommentAuthor.lastName,
          },
        });

        // when
        const jurySession = await jurySessionRepository.get(sessionId);

        // then
        expect(jurySession).to.deepEqualInstance(expectedJurySession);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id of session does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a NotFoundError', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(jurySessionRepository.get)(12345);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFiltered', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are Sessions in the database', function () {
      let sessionWithCertificationOfficerId: $TSFixMe;
      let sessionWithoutCertificationCenterId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const assignedCertificationOfficerId = databaseBuilder.factory.buildUser({
          firstName: 'Pix',
          lastName: 'Doe',
        }).id;
        sessionWithCertificationOfficerId = databaseBuilder.factory.buildSession({ assignedCertificationOfficerId }).id;
        sessionWithoutCertificationCenterId = databaseBuilder.factory.buildSession({ certificationCenterId: null }).id;

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an Array of Sessions', async function () {
        // given
        const filters = {};
        const page = { number: 1, size: 3 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { jurySessions: matchingJurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({
          filters,
          page,
        });

        // then
        expect(matchingJurySessions).to.exist;
        expect(matchingJurySessions).to.have.lengthOf(2);
        expect(matchingJurySessions[0]).to.be.an.instanceOf(JurySession);
        expect(pagination).to.deep.equal(expectedPagination);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should retrieve the assigned certification officer if there is one', async function () {
        // given
        const filters = {};
        const page = { number: 1, size: 3 };

        // when
        const { jurySessions: matchingJurySessions } = await jurySessionRepository.findPaginatedFiltered({
          filters,
          page,
        });

        // then
        const sessionWithOfficer = _.find(matchingJurySessions, { id: sessionWithCertificationOfficerId });
        const anotherSession = _.find(matchingJurySessions, { id: sessionWithoutCertificationCenterId });
        expect(sessionWithOfficer.assignedCertificationOfficer).be.an.instanceOf(CertificationOfficer);
        expect(anotherSession.assignedCertificationOfficer).not.be.an.instanceOf(CertificationOfficer);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lots of Sessions (> 10) in the database', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        _.times(12, databaseBuilder.factory.buildSession);
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated matching Sessions', async function () {
        // given
        const filters = {};
        const page = { number: 1, size: 3 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 4, rowCount: 12 };

        // when
        const { jurySessions: matchingJurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({
          filters,
          page,
        });

        // then
        expect(matchingJurySessions).to.have.lengthOf(3);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('orders', function () {
      let firstSessionId: $TSFixMe;
      let secondSessionId: $TSFixMe;
      let thirdSessionId: $TSFixMe;
      let fourthSessionId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        firstSessionId = databaseBuilder.factory.buildSession({
          finalizedAt: new Date('2020-01-01T00:00:00Z'),
          resultsSentToPrescriberAt: null,
        }).id;
        secondSessionId = databaseBuilder.factory.buildSession({
          finalizedAt: new Date('2020-01-02T00:00:00Z'),
          resultsSentToPrescriberAt: null,
        }).id;
        thirdSessionId = databaseBuilder.factory.buildSession({
          finalizedAt: new Date('2020-01-02T00:00:00Z'),
          resultsSentToPrescriberAt: new Date('2020-01-03T00:00:00Z'),
        }).id;
        fourthSessionId = databaseBuilder.factory.buildSession({
          finalizedAt: null,
          resultsSentToPrescriberAt: null,
        }).id;

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should order sessions by returning first finalized but not published, then neither of those, and finally the processed ones', async function () {
        // given
        const filters = {};
        const page = { number: 1, size: 10 };

        // when
        const { jurySessions: matchingJurySessions } = await jurySessionRepository.findPaginatedFiltered({
          filters,
          page,
        });

        // then
        expect(matchingJurySessions[0].id).to.equal(firstSessionId);
        expect(matchingJurySessions[1].id).to.equal(secondSessionId);
        expect(matchingJurySessions[2].id).to.equal(thirdSessionId);
        expect(matchingJurySessions[3].id).to.equal(fourthSessionId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('filters', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are ignored filters', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          databaseBuilder.factory.buildSession();
          databaseBuilder.factory.buildSession();

          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should ignore the filters and retrieve all certificationCenters', async function () {
          // given
          const filters = { foo: 1 };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

          // when
          const { jurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

          // then
          expect(pagination).to.deep.equal(expectedPagination);
          expect(jurySessions).to.have.length(2);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a filter on the ID', function () {
        let expectedSession: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          expectedSession = databaseBuilder.factory.buildSession({ id: 121 });
          databaseBuilder.factory.buildSession({ id: 333 });

          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should apply the strict filter and return the appropriate results', async function () {
          // given
          const filters = { id: expectedSession.id };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

          // when
          const { jurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

          // then
          expect(pagination).to.deep.equal(expectedPagination);
          expect(jurySessions[0].id).to.equal(expectedSession.id);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a filter on the certificationCenterName', function () {
        let expectedSession: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
            name: 'Université des Laura en Folie !',
          });
          expectedSession = databaseBuilder.factory.buildSession({
            certificationCenter: certificationCenter.name,
            certificationCenterId: certificationCenter.id,
          });
          databaseBuilder.factory.buildSession();

          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should find sessions by part of their certification center name, in a case-insensitive way', async function () {
          // given
          const filters = { certificationCenterName: ' Des laURa' };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

          // when
          const { jurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

          // then
          expect(pagination).to.deep.equal(expectedPagination);
          expect(jurySessions[0].id).to.equal(expectedSession.id);
          expect(jurySessions).to.have.length(1);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a filter on the certificationCenterType', function () {
        let expectedSCOSession: $TSFixMe;
        let expectedSUPSession: $TSFixMe;
        let expectedPROSession: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const certificationCenterSCO = databaseBuilder.factory.buildCertificationCenter({ type: 'SCO' });
          expectedSCOSession = databaseBuilder.factory.buildSession({
            certificationCenter: certificationCenterSCO.name,
            certificationCenterId: certificationCenterSCO.id,
          });

          const certificationCenterSUP = databaseBuilder.factory.buildCertificationCenter({ type: 'SUP' });
          expectedSUPSession = databaseBuilder.factory.buildSession({
            certificationCenter: certificationCenterSUP.name,
            certificationCenterId: certificationCenterSUP.id,
          });

          const certificationCenterPRO = databaseBuilder.factory.buildCertificationCenter({ type: 'PRO' });
          expectedPROSession = databaseBuilder.factory.buildSession({
            certificationCenter: certificationCenterPRO.name,
            certificationCenterId: certificationCenterPRO.id,
          });

          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should find sessions by part of their certification type', async function () {
          // given
          const filters = { certificationCenterType: 'SCO' };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

          // when
          const { jurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

          // then
          expect(pagination).to.deep.equal(expectedPagination);
          expect(jurySessions[0].id).to.equal(expectedSCOSession.id);
          expect(jurySessions).to.have.length(1);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return all sessions if certification type filter is null', async function () {
          // given
          const filters = { certificationCenterType: null };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

          // when
          const { jurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

          // then
          expect(pagination).to.deep.equal(expectedPagination);
          expect(jurySessions[0].id).to.equal(expectedSCOSession.id);
          expect(jurySessions[1].id).to.equal(expectedSUPSession.id);
          expect(jurySessions[2].id).to.equal(expectedPROSession.id);
          expect(jurySessions).to.have.length(3);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a filter on the certificationCenterExternalId', function () {
        let expectedSession: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          const firstCertificationCenter = databaseBuilder.factory.buildCertificationCenter({
            externalId: 'EXTIDTEST',
          });
          expectedSession = databaseBuilder.factory.buildSession({
            certificationCenter: firstCertificationCenter.name,
            certificationCenterId: firstCertificationCenter.id,
          });

          const secondCertificationCenter = databaseBuilder.factory.buildCertificationCenter({
            externalId: 'wrongExtId',
          });
          databaseBuilder.factory.buildSession({
            certificationCenter: secondCertificationCenter.name,
            certificationCenterId: secondCertificationCenter.id,
          });

          const thirdCertificationCenter = databaseBuilder.factory.buildCertificationCenter({
            externalId: 'wrongExtId',
          });
          databaseBuilder.factory.buildSession({
            certificationCenter: thirdCertificationCenter.name,
            certificationCenterId: thirdCertificationCenter.id,
          });

          return databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should find sessions by their certification center externalId', async function () {
          // given
          const filters = { certificationCenterExternalId: 'EXTIDTEST' };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 1 };

          // when
          const { jurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

          // then
          expect(pagination).to.deep.equal(expectedPagination);
          expect(jurySessions[0].id).to.equal(expectedSession.id);
          expect(jurySessions).to.have.length(1);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return all sessions if certification center external id filter is null', async function () {
          // given
          const filters = { certificationCenterExternalId: null };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

          // when
          const { jurySessions, pagination } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

          // then
          expect(pagination).to.deep.equal(expectedPagination);
          expect(jurySessions).to.have.length(3);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a filter regarding session status', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a filter on created sessions', function () {
          let expectedSessionId: $TSFixMe;

          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            expectedSessionId = databaseBuilder.factory.buildSession({ finalizedAt: null, publishedAt: null }).id;
            databaseBuilder.factory.buildSession({ finalizedAt: new Date('2020-01-01T00:00:00Z') });

            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should apply the strict filter and return the appropriate results', async function () {
            // given
const filters = { status: (statuses as $TSFixMe).CREATED };
            const page = { number: 1, size: 10 };

            // when
            const { jurySessions } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

            // then
            expect(jurySessions).to.have.length(1);
            expect(jurySessions[0].id).to.equal(expectedSessionId);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a filter on finalized sessions', function () {
          let expectedSessionId: $TSFixMe;

          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            const someDate = new Date('2020-01-01T00:00:00Z');
            expectedSessionId = databaseBuilder.factory.buildSession({
              finalizedAt: someDate,
              publishedAt: null,
              assignedCertificationOfficerId: null,
            }).id;
            databaseBuilder.factory.buildSession({
              finalizedAt: someDate,
              publishedAt: someDate,
              assignedCertificationOfficerId: null,
            });

            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should apply the strict filter and return the appropriate results', async function () {
            // given
const filters = { status: (statuses as $TSFixMe).FINALIZED };
            const page = { number: 1, size: 10 };

            // when
            const { jurySessions } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

            // then
            expect(jurySessions).to.have.length(1);
            expect(jurySessions[0].id).to.equal(expectedSessionId);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a filter on in process sessions', function () {
          let expectedSessionId: $TSFixMe;

          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            const someDate = new Date('2020-01-01T00:00:00Z');
            const assignedCertificationOfficerId = databaseBuilder.factory.buildUser().id;
            expectedSessionId = databaseBuilder.factory.buildSession({
              finalizedAt: someDate,
              publishedAt: null,
              assignedCertificationOfficerId,
            }).id;
            databaseBuilder.factory.buildSession({ publishedAt: someDate, assignedCertificationOfficerId });

            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should apply the strict filter and return the appropriate results', async function () {
            // given
const filters = { status: (statuses as $TSFixMe).IN_PROCESS };
            const page = { number: 1, size: 10 };

            // when
            const { jurySessions } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

            // then
            expect(jurySessions).to.have.length(1);
            expect(jurySessions[0].id).to.equal(expectedSessionId);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a filter on published sessions', function () {
          let expectedSessionId: $TSFixMe;

          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            const someDate = new Date('2020-01-01T00:00:00Z');
            expectedSessionId = databaseBuilder.factory.buildSession({ publishedAt: someDate }).id;
            databaseBuilder.factory.buildSession({ publishedAt: null });

            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should apply the strict filter and return the appropriate results', async function () {
            // given
const filters = { status: (statuses as $TSFixMe).PROCESSED };
            const page = { number: 1, size: 10 };

            // when
            const { jurySessions } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

            // then
            expect(jurySessions).to.have.length(1);
            expect(jurySessions[0].id).to.equal(expectedSessionId);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is a filter regarding resultsSentToPrescriberAt state', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a filter on sessions which results have been sent to prescriber', function () {
          let expectedSessionId: $TSFixMe;

          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            expectedSessionId = databaseBuilder.factory.buildSession({
              resultsSentToPrescriberAt: new Date('2020-01-01T00:00:00Z'),
            }).id;
            databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: null });

            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should apply the strict filter and return the appropriate results', async function () {
            // given
            const filters = { resultsSentToPrescriberAt: true };
            const page = { number: 1, size: 10 };

            // when
            const { jurySessions } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

            // then
            expect(jurySessions).to.have.length(1);
            expect(jurySessions[0].id).to.equal(expectedSessionId);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is a filter on sessions which results have not been sent to prescriber', function () {
          let expectedSessionId: $TSFixMe;

          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: new Date('2020-01-01T00:00:00Z') });
            expectedSessionId = databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: null }).id;

            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should apply the strict filter and return the appropriate results', async function () {
            // given
            const filters = { resultsSentToPrescriberAt: false };
            const page = { number: 1, size: 10 };

            // when
            const { jurySessions } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

            // then
            expect(jurySessions).to.have.length(1);
            expect(jurySessions[0].id).to.equal(expectedSessionId);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is no filter on whether session results has been sent to prescriber or not', function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: new Date('2020-01-01T00:00:00Z') });
            databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: null });

            return databaseBuilder.commit();
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should apply the strict filter and return the appropriate results', async function () {
            // given
            const filters = {};
            const page = { number: 1, size: 10 };

            // when
            const { jurySessions } = await jurySessionRepository.findPaginatedFiltered({ filters, page });

            // then
            expect(jurySessions).to.have.length(2);
          });
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#assignCertificationOfficer', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an updated Session domain object', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession({ assignedCertificationOfficerId: null }).id;
      const assignedCertificationOfficerId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      const updatedSession = await jurySessionRepository.assignCertificationOfficer({
        id: sessionId,
        assignedCertificationOfficerId,
      });

      // then
      expect(updatedSession).to.be.an.instanceof(JurySession);
      expect(updatedSession.id).to.deep.equal(sessionId);
      expect(updatedSession.assignedCertificationOfficer.id).to.deep.equal(assignedCertificationOfficerId);
      expect(updatedSession.status).to.deep.equal((statuses as $TSFixMe).IN_PROCESS);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assignedCertificationOfficerId provided does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a Not found error', async function () {
        // given
        const sessionId = databaseBuilder.factory.buildSession({ assignedCertificationOfficerId: null }).id;
        const assignedCertificationOfficerId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();
        const unknownUserId = assignedCertificationOfficerId + 1;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(jurySessionRepository.assignCertificationOfficer)({
          id: sessionId,
          assignedCertificationOfficerId: unknownUserId,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when sessionId does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a Not found error', async function () {
        // given
        const sessionId = databaseBuilder.factory.buildSession({ assignedCertificationOfficerId: null }).id;
        const assignedCertificationOfficerId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();
        const unknownSessionId = sessionId + 1;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(jurySessionRepository.assignCertificationOfficer)({
          id: unknownSessionId,
          assignedCertificationOfficerId,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });
});
