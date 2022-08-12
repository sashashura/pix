// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionSummaryRepository = require('../../../../../lib/infrastructure/repositories/sessions/session-summary-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Session Summary', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedByCertificationCenterId', function () {
    let page: $TSFixMe;
    let certificationCenterId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      await databaseBuilder.commit();
      page = { number: 1, size: 4 };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given certification center has no session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // given
        const otherCertificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
        databaseBuilder.factory.buildSession({ certificationCenterId: otherCertificationCenterId });
        await databaseBuilder.commit();

        // when
        const { models: sessionSummaries, meta } = await sessionSummaryRepository.findPaginatedByCertificationCenterId({
          certificationCenterId,
          page,
        });

        // then
        expect(sessionSummaries).to.deepEqualArray([]);
        expect(meta.hasSessions).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given certification center has sessions', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a session summary with all attributes', async function () {
        // given
        databaseBuilder.factory.buildSession({
          id: 456,
          address: 'ici',
          room: 'labas',
          date: '2020-01-02',
          time: '17:00:00',
          examiner: 'Moi',
          finalizedAt: new Date('2021-01-02'),
          publishedAt: null,
          certificationCenterId,
        });
        await databaseBuilder.commit();

        // when
        const { models: sessionSummaries } = await sessionSummaryRepository.findPaginatedByCertificationCenterId({
          certificationCenterId,
          page,
        });

        // then
        const expectedSessionSummary = domainBuilder.buildSessionSummary.finalized({
          id: 456,
          address: 'ici',
          room: 'labas',
          date: '2020-01-02',
          time: '17:00:00',
          examiner: 'Moi',
          enrolledCandidatesCount: 0,
          effectiveCandidatesCount: 0,
        });
        expect(sessionSummaries[0]).to.be.deepEqualInstance(expectedSessionSummary);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return hasSessions to true if the certification center has at least one session', async function () {
        // given
        databaseBuilder.factory.buildSession({ certificationCenterId });
        await databaseBuilder.commit();

        // when
        const { meta } = await sessionSummaryRepository.findPaginatedByCertificationCenterId({
          certificationCenterId,
          page,
        });

        // then
        expect(meta.hasSessions).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should sort sessions by descending date and time, and finally by ID ascending', async function () {
        // given
        databaseBuilder.factory.buildSession({ id: 1, certificationCenterId, date: '2020-01-01', time: '18:00:00' });
        databaseBuilder.factory.buildSession({ id: 2, certificationCenterId, date: '2020-01-01', time: '15:00:00' });
        databaseBuilder.factory.buildSession({ id: 3, certificationCenterId, date: '2021-01-01' });
        databaseBuilder.factory.buildSession({ id: 4, certificationCenterId, date: '2020-01-01', time: '15:00:00' });
        await databaseBuilder.commit();

        // when
        const { models: sessionSummaries } = await sessionSummaryRepository.findPaginatedByCertificationCenterId({
          certificationCenterId,
          page,
        });

        // then
        expect(sessionSummaries).to.have.lengthOf(4);
        expect(_.map(sessionSummaries, 'id')).to.deep.equal([3, 1, 2, 4]);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when sessions have candidates', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return correct enrolled candidates count and effective candidates count', async function () {
          // given
          const sessionA = databaseBuilder.factory.buildSession({
            certificationCenterId,
            createdAt: new Date('2019-01-01'),
            finalizedAt: new Date('2020-01-01'),
          });
          const sessionB = databaseBuilder.factory.buildSession({
            certificationCenterId,
            createdAt: new Date('2018-01-01'),
            publishedAt: new Date('2020-02-01'),
          });
          _buildEnrolledOnlyCandidate(sessionA.id);
          _buildEnrolledOnlyCandidate(sessionB.id);
          _buildEnrolledOnlyCandidate(sessionB.id);
          _buildEnrolledAndEffectiveCandidate(sessionB.id);
          await databaseBuilder.commit();

          // when
          const { models: sessionSummaries } = await sessionSummaryRepository.findPaginatedByCertificationCenterId({
            certificationCenterId,
            page,
          });

          // then
          const expectedSessionA = domainBuilder.buildSessionSummary.finalized({
            ...sessionA,
            enrolledCandidatesCount: 1,
            effectiveCandidatesCount: 0,
          });
          const expectedSessionB = domainBuilder.buildSessionSummary.processed({
            ...sessionB,
            enrolledCandidatesCount: 3,
            effectiveCandidatesCount: 1,
          });
          expect(sessionSummaries[0]).to.deepEqualInstance(expectedSessionA);
          expect(sessionSummaries[1]).to.deepEqualInstance(expectedSessionB);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when session does not have candidates at all', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 0 as enrolled and effective candidates count', async function () {
          // given
          databaseBuilder.factory.buildSession({ certificationCenterId });
          await databaseBuilder.commit();

          // when
          const { models: sessionSummaries } = await sessionSummaryRepository.findPaginatedByCertificationCenterId({
            certificationCenterId,
            page,
          });

          // then
          expect(sessionSummaries[0]).to.include({ enrolledCandidatesCount: 0, effectiveCandidatesCount: 0 });
        });
      });
    });
  });
});

function _buildEnrolledOnlyCandidate(sessionId: $TSFixMe) {
  databaseBuilder.factory.buildCertificationCandidate({ sessionId });
}

function _buildEnrolledAndEffectiveCandidate(sessionId: $TSFixMe) {
  const userId = databaseBuilder.factory.buildUser().id;
  databaseBuilder.factory.buildCertificationCandidate({ userId, sessionId });
  databaseBuilder.factory.buildCertificationCourse({ userId, sessionId });
}
