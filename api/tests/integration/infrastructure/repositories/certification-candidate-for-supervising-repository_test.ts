// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, databaseBuilder, expect, knex, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCandidateForSupervisingRepository = require('../../../../lib/infrastructure/repositories/certification-candidate-for-supervising-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | certification candidate for supervising', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when certification candidate is found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the certification candidate', async function () {
        // given
        const session = databaseBuilder.factory.buildSession();
        const user = databaseBuilder.factory.buildUser();
        const candidate = databaseBuilder.factory.buildCertificationCandidate({
          lastName: 'Joplin',
          firstName: 'Janis',
          sessionId: session.id,
          userId: user.id,
          authorizedToStart: false,
        });
        const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
          userId: user.id,
          sessionId: session.id,
        });
        databaseBuilder.factory.buildAssessment({
          certificationCourseId: certificationCourse.id,
          state: Assessment.states.STARTED,
        });

        await databaseBuilder.commit();

        // when
        const result = await certificationCandidateForSupervisingRepository.get(candidate.id);

        // then
        expect(result).to.deep.equal(
          domainBuilder.buildCertificationCandidateForSupervising({
            sessionId: session.id,
            userId: 1234,
            authorizedToStart: false,
            birthdate: '2000-01-04',
            extraTimePercentage: '0.30',
            firstName: 'Janis',
            id: candidate.id,
            lastName: 'Joplin',
            assessmentStatus: 'started',
          })
        );
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when certification candidate is not found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const session = databaseBuilder.factory.buildSession({ id: 23049 });
        databaseBuilder.factory.buildUser({ id: 1234 });
        databaseBuilder.factory.buildCertificationCandidate({
          sessionId: session.id,
          userId: 1234,
          authorizedToStart: false,
          birthdate: '2000-01-04',
          extraTimePercentage: '0.30',
          firstName: 'first-name',
          id: 456,
          lastName: 'last-name',
        });

        await databaseBuilder.commit();
        const wrongCandidateId = 1298;

        // when
        const certificationCandidateForSupervising = {
          id: wrongCandidateId,
          authorizedToStart: true,
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(certificationCandidateForSupervisingRepository.update)(
          certificationCandidateForSupervising
        );

        // then
        expect(error).to.be.an.instanceOf(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when certification candidate is found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update isAuthorisedToStart certification candidate attribute', async function () {
        // given
        const session = databaseBuilder.factory.buildSession();
        databaseBuilder.factory.buildUser({ id: 1234 });
        const certificationCandidate = databaseBuilder.factory.buildCertificationCandidate({
          sessionId: session.id,
          userId: 1234,
          authorizedToStart: false,
          birthdate: '2000-01-04',
          extraTimePercentage: '0.30',
          firstName: 'first-name',
          id: 456,
          lastName: 'last-name',
        });

        await databaseBuilder.commit();

        // when
        const certificationCandidateForSupervising = {
          id: certificationCandidate.id,
          authorizedToStart: true,
        };
        await certificationCandidateForSupervisingRepository.update(certificationCandidateForSupervising);

        // then
        const authorizedToStart = await knex
          .select('authorizedToStart')
          .from('certification-candidates')
          .where({ id: certificationCandidate.id })
          .first();

        expect(authorizedToStart).to.deep.equals({ authorizedToStart: true });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when certification candidate is not found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const session = databaseBuilder.factory.buildSession({ id: 23049 });
        databaseBuilder.factory.buildUser({ id: 1234 });
        databaseBuilder.factory.buildCertificationCandidate({
          sessionId: session.id,
          userId: 1234,
          authorizedToStart: false,
          birthdate: '2000-01-04',
          extraTimePercentage: '0.30',
          firstName: 'first-name',
          id: 456,
          lastName: 'last-name',
        });

        await databaseBuilder.commit();
        const wrongCandidateId = 1298;

        // when
        const certificationCandidateForSupervising = {
          id: wrongCandidateId,
          authorizedToStart: true,
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(certificationCandidateForSupervisingRepository.update)(
          certificationCandidateForSupervising
        );

        // then
        expect(error).to.be.an.instanceOf(NotFoundError);
      });
    });
  });
});
