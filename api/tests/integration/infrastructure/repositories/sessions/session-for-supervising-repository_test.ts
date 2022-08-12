// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForSupervising = require('../../../../../lib/domain/read-models/SessionForSupervising');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionForSupervisingRepository = require('../../../../../lib/infrastructure/repositories/sessions/session-for-supervising-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | SessionForSupervising', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return session informations in a SessionForSupervising Object', async function () {
      // given
      databaseBuilder.factory.buildCertificationCenter({ name: 'Toto', id: 1234 });
      const session = databaseBuilder.factory.buildSession({
        certificationCenter: 'Tour Gamma',
        room: 'Salle A',
        examiner: 'Monsieur Examinateur',
        date: '2018-02-23',
        time: '12:00:00',
        certificationCenterId: 1234,
      });

      await databaseBuilder.commit();

      // when
      const actualSession = await sessionForSupervisingRepository.get(session.id);

      // then
      expect(actualSession).to.be.deepEqualInstance(
        new SessionForSupervising({
          id: session.id,
          certificationCenterName: 'Toto',
          room: 'Salle A',
          examiner: 'Monsieur Examinateur',
          date: '2018-02-23',
          time: '12:00:00',
          certificationCandidates: [],
        })
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return associated certifications candidates ordered by lastname and firstname', async function () {
      // given
      databaseBuilder.factory.buildCertificationCenter({ name: 'Toto', id: 1234 });
      const session = databaseBuilder.factory.buildSession({
        certificationCenter: 'Tour Gamma',
        room: 'Salle A',
        examiner: 'Monsieur Examinateur',
        date: '2018-02-23',
        time: '12:00:00',
        certificationCenterId: 1234,
      });

      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Jackson',
        firstName: 'Michael',
        sessionId: session.id,
        authorizedToStart: true,
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
      databaseBuilder.factory.buildUser({ id: 12345 });
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Joplin',
        firstName: 'Janis',
        sessionId: session.id,
        userId: 12345,
        authorizedToStart: true,
      });

      const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
        userId: 12345,
        sessionId: session.id,
      });

      databaseBuilder.factory.buildAssessment({
        certificationCourseId: certificationCourse.id,
        state: Assessment.states.STARTED,
      });
      databaseBuilder.factory.buildCertificationCandidate();
      await databaseBuilder.commit();

      // when
      const actualSession = await sessionForSupervisingRepository.get(session.id);

      // then
      const actualCandidates = _.map(actualSession.certificationCandidates, (item: $TSFixMe) => _.pick(item, ['sessionId', 'lastName', 'firstName', 'authorizedToStart', 'assessmentStatus'])
      );
      expect(actualCandidates).to.have.deep.ordered.members([
        { lastName: 'Jackson', firstName: 'Janet', authorizedToStart: false, assessmentStatus: null },
        { lastName: 'Jackson', firstName: 'Michael', authorizedToStart: true, assessmentStatus: null },
        {
          lastName: 'Joplin',
          firstName: 'Janis',
          authorizedToStart: true,
          assessmentStatus: Assessment.states.STARTED,
        },
        { lastName: 'Stardust', firstName: 'Ziggy', authorizedToStart: false, assessmentStatus: null },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a Not found error when no session was found', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(sessionForSupervisingRepository.get)(123123);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
