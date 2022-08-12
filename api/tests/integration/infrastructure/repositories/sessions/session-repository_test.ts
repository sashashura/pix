// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, knex, domainBuilder, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../../../lib/domain/models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('../../../../../lib/domain/models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../../../../lib/infrastructure/repositories/sessions/session-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Session', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    let session: $TSFixMe, certificationCenter;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      certificationCenter = databaseBuilder.factory.buildCertificationCenter({});
      session = new Session({
        certificationCenter: certificationCenter.name,
        certificationCenterId: certificationCenter.id,
        address: 'Nice',
        room: '28D',
        examiner: 'Michel Essentiel',
        date: '2017-12-08',
        time: '14:30:00',
        description: 'Première certification EVER !!!',
        examinerGlobalComment: 'No comment',
        hasIncident: true,
        hasJoiningIssue: true,
        finalizedAt: new Date('2017-12-07'),
        publishedAt: new Date('2017-12-07'),
        resultsSentToPrescriberAt: new Date('2017-12-07'),
        assignedCertificationOfficerId: null,
        accessCode: 'XXXX',
        supervisorPassword: 'AB2C7',
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('sessions').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should persist the session in db', async function () {
      // when
      await sessionRepository.save(session);

      // then
      const sessionSaved = await knex('sessions').select();
      expect(sessionSaved).to.have.lengthOf(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the saved Session', async function () {
      // when
      const savedSession = await sessionRepository.save(session);

      // then
      expect(savedSession).to.be.an.instanceOf(Session);
      expect(savedSession).to.have.property('id').and.not.null;
      expect(savedSession).to.deepEqualInstance(new Session({ ...session, id: savedSession.id }));
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isSessionCodeAvailable', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      databaseBuilder.factory.buildSession({
        certificationCenter: 'Paris',
        address: 'Paris',
        room: 'The lost room',
        examiner: 'Bernard',
        date: '2018-02-23',
        time: '12:00',
        description: 'The lost examen',
        accessCode: 'ABC123',
      });

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the accessCode is not in database', async function () {
      // given
      const accessCode = 'DEF123';

      // when
      const isAvailable = await sessionRepository.isSessionCodeAvailable(accessCode);

      // then
      expect(isAvailable).to.be.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the accessCode is in database', async function () {
      // given
      const accessCode = 'ABC123';

      // when
      const isAvailable = await sessionRepository.isSessionCodeAvailable(accessCode);

      // then
      expect(isAvailable).to.be.equal(false);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isFinalized', function () {
    let finalizedSessionId: $TSFixMe;
    let notFinalizedSessionId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      finalizedSessionId = databaseBuilder.factory.buildSession({ finalizedAt: new Date() }).id;
      notFinalizedSessionId = databaseBuilder.factory.buildSession({ finalizedAt: null }).id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the session status is finalized', async function () {
      // when
      const isFinalized = await sessionRepository.isFinalized(finalizedSessionId);

      // then
      expect(isFinalized).to.be.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the session status is not finalized', async function () {
      // when
      const isFinalized = await sessionRepository.isFinalized(notFinalizedSessionId);

      // then
      expect(isFinalized).to.be.equal(false);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let session: $TSFixMe;
    let expectedSessionValues: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      session = databaseBuilder.factory.buildSession({
        certificationCenter: 'Tour Gamma',
        address: 'rue de Bercy',
        room: 'Salle A',
        examiner: 'Monsieur Examinateur',
        date: '2018-02-23',
        time: '12:00:00',
        description: 'CertificationPix pour les jeunes',
        accessCode: 'NJR10',
      });
      expectedSessionValues = {
        id: session.id,
        certificationCenter: session.certificationCenter,
        address: session.address,
        room: session.room,
        examiner: session.examiner,
        date: session.date,
        time: session.time,
        description: session.description,
        accessCode: session.accessCode,
      };
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return session informations in a session Object', async function () {
      // when
      const actualSession = await sessionRepository.get(session.id);

      // then
      expect(actualSession).to.be.instanceOf(Session);
      expect(actualSession, 'date').to.deep.includes(expectedSessionValues);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a Not found error when no session was found', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(sessionRepository.get)(2);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getWithCertificationCandidates', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return session information in a session Object', async function () {
      // given
      const session = databaseBuilder.factory.buildSession({
        certificationCenter: 'Tour Gamma',
        address: 'rue de Bercy',
        room: 'Salle A',
        examiner: 'Monsieur Examinateur',
        date: '2018-02-23',
        time: '12:00:00',
        description: 'CertificationPix pour les jeunes',
        accessCode: 'NJR10',
      });
      await databaseBuilder.commit();

      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      const expectedSession = domainBuilder.buildSession(session);
      expect(actualSession).to.deepEqualInstance(expectedSession);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return associated certification candidates ordered by lastname and firstname', async function () {
      // given
      const session = databaseBuilder.factory.buildSession();
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Jackson',
        firstName: 'Michael',
        sessionId: session.id,
      });
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Stardust',
        firstName: 'Ziggy',
        sessionId: session.id,
      });
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Jackson',
        firstName: 'Janet',
        sessionId: session.id,
      });
      _.times(5, () => databaseBuilder.factory.buildCertificationCandidate());
      await databaseBuilder.commit();

      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      const actualCandidates = _.map(actualSession.certificationCandidates, (item: $TSFixMe) => _.pick(item, ['sessionId', 'lastName', 'firstName'])
      );
      expect(actualCandidates).to.have.deep.ordered.members([
        { sessionId: session.id, lastName: 'Jackson', firstName: 'Janet' },
        { sessionId: session.id, lastName: 'Jackson', firstName: 'Michael' },
        { sessionId: session.id, lastName: 'Stardust', firstName: 'Ziggy' },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty certification candidates array if there is no candidates', async function () {
      // given
      const session = databaseBuilder.factory.buildSession();
      await databaseBuilder.commit();

      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      expect(actualSession.certificationCandidates).to.deep.equal([]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return candidates complementary certifications', async function () {
      // given
      const session = databaseBuilder.factory.buildSession();
      const pixPlusFoot = databaseBuilder.factory.buildComplementaryCertification({ label: 'Pix+ Foot', key: 'FOOT' });
      const pixPlusRugby = databaseBuilder.factory.buildComplementaryCertification({
        label: 'Pix+ Rugby',
        key: 'RUGBY',
      });
      const pixPlusTennis = databaseBuilder.factory.buildComplementaryCertification({
        label: 'Pix+ Tennis',
        key: 'TENNIS',
      });
      const firstCandidate = databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Jackson',
        firstName: 'Michael',
        sessionId: session.id,
      });
      const secondCandidate = databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Stardust',
        firstName: 'Ziggy',
        sessionId: session.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationSubscription({
        certificationCandidateId: firstCandidate.id,
        complementaryCertificationId: pixPlusRugby.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationSubscription({
        certificationCandidateId: secondCandidate.id,
        complementaryCertificationId: pixPlusFoot.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationSubscription({
        certificationCandidateId: secondCandidate.id,
        complementaryCertificationId: pixPlusTennis.id,
      });
      await databaseBuilder.commit();

      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      const [firstCandidateFromSession, secondCandidateFromSession] = actualSession.certificationCandidates;
      expect(firstCandidateFromSession.complementaryCertifications).to.deep.equal([
        domainBuilder.buildComplementaryCertification(pixPlusRugby),
      ]);
      expect(secondCandidateFromSession.complementaryCertifications).to.deep.equal([
        domainBuilder.buildComplementaryCertification(pixPlusFoot),
        domainBuilder.buildComplementaryCertification(pixPlusTennis),
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty candidates complementary certifications if there is no complementary certifications', async function () {
      // given
      const session = databaseBuilder.factory.buildSession();
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Jackson',
        firstName: 'Michael',
        sessionId: session.id,
      });
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Stardust',
        firstName: 'Ziggy',
        sessionId: session.id,
      });
      await databaseBuilder.commit();

      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      const [firstCandidateFromSession, secondCandidateFromSession] = actualSession.certificationCandidates;
      expect(firstCandidateFromSession.complementaryCertifications).to.deep.equal([]);
      expect(secondCandidateFromSession.complementaryCertifications).to.deep.equal([]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a Not found error when no session was found', async function () {
      // given
      const session = databaseBuilder.factory.buildSession();
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(sessionRepository.get)(session.id + 1);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateSessionInfo', function () {
    let session: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const savedSession = databaseBuilder.factory.buildSession();
      session = domainBuilder.buildSession(savedSession);
      session.room = 'New room';
      session.examiner = 'New examiner';
      session.address = 'New address';
      session.accessCode = 'BABAAURHUM';
      session.date = '2010-01-01';
      session.time = '12:00:00';
      session.description = 'New description';

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a Session domain object', async function () {
      // when
      const sessionSaved = await sessionRepository.updateSessionInfo(session);

      // then
      expect(sessionSaved).to.be.an.instanceof(Session);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update model in database', async function () {
      // given

      // when
      const sessionSaved = await sessionRepository.updateSessionInfo(session);

      // then
      expect(sessionSaved.id).to.equal(session.id);
      expect(sessionSaved.room).to.equal(session.room);
      expect(sessionSaved.examiner).to.equal(session.examiner);
      expect(sessionSaved.address).to.equal(session.address);
      expect(sessionSaved.accessCode).to.equal(session.accessCode);
      expect(sessionSaved.date).to.equal(session.date);
      expect(sessionSaved.time).to.equal(session.time);
      expect(sessionSaved.description).to.equal(session.description);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#doesUserHaveCertificationCenterMembershipForSession', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if user has membership in the certification center that originated the session', async function () {
      // given
      const userId = 1;
      const userIdNotAllowed = 2;
      databaseBuilder.factory.buildUser({ id: userId });
      databaseBuilder.factory.buildUser({ id: userIdNotAllowed });
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const certificationCenterNotAllowedId = databaseBuilder.factory.buildCertificationCenter().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
      databaseBuilder.factory.buildCertificationCenterMembership({
        userId: userIdNotAllowed,
        certificationCenterId: certificationCenterNotAllowedId,
      });
      const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

      await databaseBuilder.commit();

      // when
      const hasMembership = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
        userId,
        sessionId
      );

      // then
      expect(hasMembership).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if user has a disabled membership in the certification center that originated the session', async function () {
      //given
      const userId = 1;
      const now = new Date();
      databaseBuilder.factory.buildUser({ id: userId });
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId, disabledAt: now });
      const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

      await databaseBuilder.commit();

      // when
      const hasMembership = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
        userId,
        sessionId
      );

      // then
      expect(hasMembership).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if user has no membership in the certification center that originated the session', async function () {
      //given
      const userId = 1;
      const userIdNotAllowed = 2;
      databaseBuilder.factory.buildUser({ id: userId });
      databaseBuilder.factory.buildUser({ id: userIdNotAllowed });
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const certificationCenterNotAllowedId = databaseBuilder.factory.buildCertificationCenter().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
      databaseBuilder.factory.buildCertificationCenterMembership({
        userId: userIdNotAllowed,
        certificationCenterId: certificationCenterNotAllowedId,
      });
      const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

      await databaseBuilder.commit();

      // when
      const hasMembership = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
        userIdNotAllowed,
        sessionId
      );

      // then
      expect(hasMembership).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#finalize', function () {
    let id: $TSFixMe;
    const examinerGlobalComment = '';
    const hasIncident = false;
    const hasJoiningIssue = true;
    const finalizedAt = new Date('2017-09-01T12:14:33Z');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      id = databaseBuilder.factory.buildSession({ finalizedAt: null }).id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an updated Session domain object', async function () {
      // when
      const sessionSaved = await sessionRepository.finalize({
        id,
        examinerGlobalComment,
        hasIncident,
        hasJoiningIssue,
        finalizedAt,
      });

      // then
      expect(sessionSaved).to.be.an.instanceof(Session);
      expect(sessionSaved.id).to.deep.equal(id);
      expect(sessionSaved.examinerGlobalComment).to.deep.equal(examinerGlobalComment);
      expect(sessionSaved.hasIncident).to.deep.equal(hasIncident);
      expect(sessionSaved.hasJoiningIssue).to.deep.equal(hasJoiningIssue);
      expect(sessionSaved.status).to.deep.equal((statuses as $TSFixMe).FINALIZED);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#flagResultsAsSentToPrescriber', function () {
    let id: $TSFixMe;
    const resultsSentToPrescriberAt = new Date('2017-09-01T12:14:33Z');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      id = databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: null }).id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a flagged Session domain object', async function () {
      // when
      const sessionFlagged = await sessionRepository.flagResultsAsSentToPrescriber({ id, resultsSentToPrescriberAt });

      // then
      expect(sessionFlagged).to.be.an.instanceof(Session);
      expect(sessionFlagged.id).to.deep.equal(id);
      expect(sessionFlagged.resultsSentToPrescriberAt).to.deep.equal(resultsSentToPrescriberAt);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updatePublishedAt', function () {
    let id: $TSFixMe;
    const publishedAt = new Date('2017-09-01T12:14:33Z');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      id = databaseBuilder.factory.buildSession({ publishedAt: null }).id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a updated Session domain object', async function () {
      // when
      const sessionFlagged = await sessionRepository.updatePublishedAt({ id, publishedAt });

      // then
      expect(sessionFlagged).to.be.an.instanceof(Session);
      expect(sessionFlagged.id).to.deep.equal(id);
      expect(sessionFlagged.publishedAt).to.deep.equal(publishedAt);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isSco', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center is not SCO', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', async function () {
        // given
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
          name: 'PRO_CERTIFICATION_CENTER',
          type: 'PRO',
          externalId: 'EXTERNAL_ID',
        });

        const session = databaseBuilder.factory.buildSession({
          certificationCenter: certificationCenter.name,
          certificationCenterId: certificationCenter.id,
          finalizedAt: null,
          publishedAt: null,
        });

        await databaseBuilder.commit();

        // when
        const result = await sessionRepository.isSco({
          sessionId: session.id,
        });

        // then
        expect(result).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center is SCO', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
          name: 'SCO',
          externalId: 'EXTERNAL_ID',
          type: 'SCO',
        });

        const session = databaseBuilder.factory.buildSession({
          certificationCenter: certificationCenter.name,
          certificationCenterId: certificationCenter.id,
          finalizedAt: null,
          publishedAt: null,
        });

        await databaseBuilder.commit();

        // when
        const result = await sessionRepository.isSco({
          sessionId: session.id,
        });

        // then
        expect(result).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session exists', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the session has candidates', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should remove candidates and delete the session', async function () {
          // given
          const sessionId = databaseBuilder.factory.buildSession().id;
          databaseBuilder.factory.buildCertificationCandidate({ sessionId });
          databaseBuilder.factory.buildCertificationCandidate({ sessionId });

          await databaseBuilder.commit();

          // when
          await sessionRepository.delete(sessionId);

          // then
          const foundSession = await knex('sessions').select('id').where({ id: sessionId }).first();
          const candidates = await knex('certification-candidates').where({ sessionId });
          expect(foundSession).to.be.undefined;
          expect(candidates).to.be.empty;
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when candidates have complementary certification subscriptions', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should remove complementary certification subscriptions', async function () {
            // given
            const sessionId = databaseBuilder.factory.buildSession().id;
            const certificationCandidateId = databaseBuilder.factory.buildCertificationCandidate({ sessionId }).id;

            const complementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification({
              id: 123,
            }).id;
            databaseBuilder.factory.buildComplementaryCertificationSubscription({
              complementaryCertificationId: complementaryCertificationId,
              certificationCandidateId,
            });

            await databaseBuilder.commit();

            // when
            await sessionRepository.delete(sessionId);

            // then
            const foundSession = await knex('sessions').select('id').where({ id: sessionId }).first();
            const foundSubscriptions = await knex('complementary-certification-subscriptions').where({
              certificationCandidateId,
            });
            expect(foundSession).to.be.undefined;
            expect(foundSubscriptions).to.be.empty;
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the session has been accessed by one or more supervisor', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should remove supervisor accesses and delete the session', async function () {
          // given
          const sessionId = databaseBuilder.factory.buildSession().id;
          databaseBuilder.factory.buildSupervisorAccess({ sessionId });
          databaseBuilder.factory.buildSupervisorAccess({ sessionId });

          await databaseBuilder.commit();

          // when
          await sessionRepository.delete(sessionId);

          // then
          const foundSession = await knex('sessions').select('id').where({ id: sessionId }).first();
          const supervisorAccesses = await knex('supervisor-accesses').where({ sessionId });
          expect(foundSession).to.be.undefined;
          expect(supervisorAccesses).to.be.empty;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the session has no candidates', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should delete the session', async function () {
          // given
          const sessionId = databaseBuilder.factory.buildSession().id;

          await databaseBuilder.commit();

          // when
          await sessionRepository.delete(sessionId);

          // then
          const foundSession = await knex('sessions').select('id').where({ id: sessionId }).first();
          expect(foundSession).to.be.undefined;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a not found error', async function () {
        // given
        const sessionId = 123456;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(sessionRepository.delete)(sessionId);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });
});
