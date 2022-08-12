// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supervisor... Remove this comment to see the full error message
const supervisorAccessRepository = require('../../../../lib/infrastructure/repositories/supervisor-access-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | supervisor-access-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('supervisor-accesses').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save a supervisor access', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      await supervisorAccessRepository.create({ sessionId, userId });

      // then
      const supervisorAccessInDB = await knex.from('supervisor-accesses').first();
      expect(supervisorAccessInDB.sessionId).to.equal(sessionId);
      expect(supervisorAccessInDB.userId).to.equal(userId);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isUserSupervisorForSession', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if user is supervising the session', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildSupervisorAccess({ sessionId, userId });
      await databaseBuilder.commit();

      // when
      const isUserSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSession({
        sessionId,
        userId,
      });

      // then
      expect(isUserSupervisorForSession).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if user is not supervising the session', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildSupervisorAccess({ sessionId, userId });
      await databaseBuilder.commit();

      // when
      const isUserSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSession({
        sessionId: 123,
        userId: 456,
      });

      // then
      expect(isUserSupervisorForSession).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isUserSupervisorForSessionCandidate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true if the user is supervising the candidate's session", async function () {
      // given
      const supervisorId = databaseBuilder.factory.buildUser().id;
      const sessionId = databaseBuilder.factory.buildSession().id;
      databaseBuilder.factory.buildSupervisorAccess({ sessionId, userId: supervisorId });
      const certificationCandidateId = databaseBuilder.factory.buildCertificationCandidate({ sessionId }).id;
      await databaseBuilder.commit();

      // when
      const isUserSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSessionCandidate({
        certificationCandidateId,
        supervisorId,
      });

      // then
      expect(isUserSupervisorForSession).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false if the user is not supervising the candidate's session", async function () {
      // given
      const supervisorId = databaseBuilder.factory.buildUser().id;
      const sessionId = databaseBuilder.factory.buildSession().id;
      databaseBuilder.factory.buildSupervisorAccess({ sessionId, userId: supervisorId });
      const certificationCandidateId = databaseBuilder.factory.buildCertificationCandidate().id;
      await databaseBuilder.commit();

      // when
      const isUserSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSessionCandidate({
        certificationCandidateId,
        supervisorId,
      });

      // then
      expect(isUserSupervisorForSession).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sessionHasSupervisorAccess', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if session has at least one supervisor access', async function () {
      // given
      const sessionId = databaseBuilder.factory.buildSession().id;
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildSupervisorAccess({ sessionId, userId });
      await databaseBuilder.commit();

      // when
      const sessionHasSupervisorAccess = await supervisorAccessRepository.sessionHasSupervisorAccess({
        sessionId,
      });

      // then
      expect(sessionHasSupervisorAccess).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if session has no supervisor access', async function () {
      // given
      const sessionWithSupervisor = databaseBuilder.factory.buildSession();
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildSupervisorAccess({ sessionId: sessionWithSupervisor.id, userId });
      const sessionWithoutSupervisor = databaseBuilder.factory.buildSession();
      await databaseBuilder.commit();

      // when
      const sessionHasSupervisorAccess = await supervisorAccessRepository.sessionHasSupervisorAccess({
        sessionId: sessionWithoutSupervisor.id,
      });

      // then
      expect(sessionHasSupervisorAccess).to.be.false;
    });
  });
});
