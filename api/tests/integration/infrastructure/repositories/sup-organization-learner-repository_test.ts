// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerRepository = require('../../../../lib/infrastructure/repositories/sup-organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | sup-organization-learner-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOneByStudentNumber', function () {
    let organization: $TSFixMe;
    let organizationLearner: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization();
      organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: organization.id,
        studentNumber: '123A',
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return found organizationLearners with student number', async function () {
      // when
      const result = await supOrganizationLearnerRepository.findOneByStudentNumber({
        organizationId: organization.id,
        studentNumber: '123A',
      });

      // then
      expect(result.id).to.deep.equal(organizationLearner.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array when there is no organization-learners with the given student number', async function () {
      // when
      const result = await supOrganizationLearnerRepository.findOneByStudentNumber({
        organizationId: organization.id,
        studentNumber: '123B',
      });

      // then
      expect(result).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty array when there is no organization-learners with the given organizationId', async function () {
      // when
      const result = await supOrganizationLearnerRepository.findOneByStudentNumber({
        organizationId: '999',
        studentNumber: '123A',
      });

      // then
      expect(result).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOneByStudentNumberAndBirthdate', function () {
    let organizationId: $TSFixMe;
    const studentNumber = '1234567';
    const birthdate = '2000-03-31';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no registered organization learners', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildOrganizationLearner({ organizationId, studentNumber, birthdate });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        const result = await supOrganizationLearnerRepository.findOneByStudentNumberAndBirthdate({
          organizationId,
          birthdate,
          studentNumber: 'XXX',
        });

        // then
        expect(result).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no active registered organization learners', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          studentNumber,
          birthdate,
          isDisabled: true,
        });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        const result = await supOrganizationLearnerRepository.findOneByStudentNumberAndBirthdate({
          organizationId,
          studentNumber,
          birthdate,
        });

        // then
        expect(result).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no organization learners for the organization', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: otherOrganizationId,
          studentNumber,
          birthdate,
        });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        const result = await supOrganizationLearnerRepository.findOneByStudentNumberAndBirthdate({
          organizationId,
          birthdate,
          studentNumber,
        });

        // then
        expect(result).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no organization learners with given student number', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildOrganizationLearner({ organizationId, studentNumber: '999', birthdate });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        const result = await supOrganizationLearnerRepository.findOneByStudentNumberAndBirthdate({
          organizationId,
          birthdate,
          studentNumber,
        });

        // then
        expect(result).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no organization learners with given birthdate', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildOrganizationLearner({ organizationId, studentNumber, birthdate: '2000-03-30' });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        const result = await supOrganizationLearnerRepository.findOneByStudentNumberAndBirthdate({
          organizationId,
          birthdate,
          studentNumber,
        });

        // then
        expect(result).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is a matching organization learners with student number and birthdate', function () {
      let expectedOrganizationLearnerId: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        expectedOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          studentNumber,
          birthdate,
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the organization learner', async function () {
        // when
        const organizationLearner = await supOrganizationLearnerRepository.findOneByStudentNumberAndBirthdate({
          organizationId,
          studentNumber,
          birthdate,
        });

        // then
        expect(organizationLearner).to.be.an.instanceOf(OrganizationLearner);
        expect(organizationLearner.id).to.equal(expectedOrganizationLearnerId);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateStudentNumber', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the student number', async function () {
      // given
      const id = databaseBuilder.factory.buildOrganizationLearner({ studentNumber: 12345 }).id;
      await databaseBuilder.commit();

      // when
      await supOrganizationLearnerRepository.updateStudentNumber(id, 54321);
      const [organizationLearner] = await knex.select('studentNumber').from('organization-learners').where({ id });
      expect(organizationLearner.studentNumber).to.equal('54321');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addStudents', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no organization learners for the given organizationId and student number', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('creates the organization-learner', async function () {
        const organization = databaseBuilder.factory.buildOrganization();
        const supOrganizationLearner1 = domainBuilder.buildSupOrganizationLearner({
          organization,
          firstName: 'O-Ren',
          lastName: 'Ishii',
          studentNumber: '4',
          birthdate: '1990-07-01',
        });
        const supOrganizationLearner2 = domainBuilder.buildSupOrganizationLearner({
          organization,
          firstName: 'John',
          lastName: 'Rambo',
          studentNumber: '5',
          birthdate: '1990-07-02',
        });
        await databaseBuilder.commit();

        await supOrganizationLearnerRepository.addStudents([supOrganizationLearner1, supOrganizationLearner2]);

        const results = await knex('organization-learners')
          .select('*', 'status AS studyScheme')
          .where({ organizationId: organization.id })
          .orderBy('studentNumber');

        expect(results.length).to.equal(2);
        expect(results[0].studentNumber).to.equal('4');
        expect(results[1].studentNumber).to.equal('5');
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is organization learners for the given organizationId and student number', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('updates the organization-learners', async function () {
          const organization = databaseBuilder.factory.buildOrganization();
          const supOrganizationLearner = domainBuilder.buildSupOrganizationLearner({
            organization,
            firstName: 'O-Ren',
            lastName: 'Ishii',
            studentNumber: '4',
            birthdate: '1990-07-01',
          });

          databaseBuilder.factory.buildOrganizationLearner({
            organizationId: organization.id,
            studentNumber: '4',
            updatedAt: new Date('2000-01-01'),
          });
          await databaseBuilder.commit();

          await supOrganizationLearnerRepository.addStudents([
            { ...supOrganizationLearner, lastName: 'Ishii updated' },
          ]);

          const results = await knex('organization-learners')
            .select('*', 'status AS studyScheme')
            .where({ organizationId: organization.id })
            .orderBy('studentNumber');

          expect(results.length).to.equal(1);
          expect(results[0].lastName).to.equal('Ishii updated');
          expect(results[0].updatedAt).to.not.deep.equal(new Date('2000-01-01'));
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(
        'when there is a disabled organization learners for the given organizationId and student number',
        function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('enables the organization-learners', async function () {
            const organization = databaseBuilder.factory.buildOrganization();
            databaseBuilder.factory.buildOrganizationLearner({
              organizationId: organization.id,
              studentNumber: '4',
              isDisabled: true,
            });
            await databaseBuilder.commit();

            const supOrganizationLearner = domainBuilder.buildSupOrganizationLearner({
              organization,
              studentNumber: '4',
            });
            await supOrganizationLearnerRepository.addStudents([supOrganizationLearner]);

            const result = await knex('organization-learners')
              .select('isDisabled')
              .where({ organizationId: organization.id })
              .where({ studentNumber: '4' })
              .first();

            expect(result.isDisabled).to.be.false;
          });
        }
      );

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is organization learners for an other organizationId and student number', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('creates the organization-learners', async function () {
          const organization1 = databaseBuilder.factory.buildOrganization();
          const organization2 = databaseBuilder.factory.buildOrganization();
          databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization1.id, studentNumber: '4' });
          await databaseBuilder.commit();

          const supOrganizationLearner = domainBuilder.buildSupOrganizationLearner({
            organization: organization2,
            firstName: 'O-Ren',
            lastName: 'Ishii',
            studentNumber: '4',
            birthdate: '1990-07-01',
          });
          await supOrganizationLearnerRepository.addStudents([{ ...supOrganizationLearner }]);

          const results = await knex('organization-learners')
            .select('*', 'status AS studyScheme')
            .where({ organizationId: organization2.id })
            .orderBy('studentNumber');

          expect(results.length).to.equal(1);
          expect(results[0].studentNumber).to.equal('4');
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#replaceStudents', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no organization learners for the given organizationId and student number', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('creates the organization-learner', async function () {
        const organization = databaseBuilder.factory.buildOrganization();
        const supOrganizationLearner1 = domainBuilder.buildSupOrganizationLearner({
          organization,
          firstName: 'O-Ren',
          lastName: 'Ishii',
          studentNumber: '4',
          birthdate: '1990-07-01',
        });
        const supOrganizationLearner2 = domainBuilder.buildSupOrganizationLearner({
          organization,
          firstName: 'John',
          lastName: 'Rambo',
          studentNumber: '5',
          birthdate: '1990-07-02',
        });
        await databaseBuilder.commit();

        await supOrganizationLearnerRepository.replaceStudents(organization.id, [
          supOrganizationLearner1,
          supOrganizationLearner2,
        ]);

        const results = await knex('organization-learners')
          .select('*', 'status AS studyScheme')
          .where({ organizationId: organization.id })
          .orderBy('studentNumber');

        expect(results.length).to.equal(2);
        expect(results[0].studentNumber).to.equal('4');
        expect(results[1].studentNumber).to.equal('5');
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is organization learners for the given organizationId and student number', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('updates the organization-learners', async function () {
          const organization = databaseBuilder.factory.buildOrganization();
          const supOrganizationLearner = domainBuilder.buildSupOrganizationLearner({
            organization,
            firstName: 'O-Ren',
            lastName: 'Ishii',
            studentNumber: '4',
            birthdate: '1990-07-01',
          });

          databaseBuilder.factory.buildOrganizationLearner({
            organizationId: organization.id,
            studentNumber: '4',
            updatedAt: new Date('2000-01-01'),
          });
          await databaseBuilder.commit();

          await supOrganizationLearnerRepository.replaceStudents(organization.id, [
            { ...supOrganizationLearner, lastName: 'Ishii updated' },
          ]);

          const results = await knex('organization-learners')
            .select('*', 'status AS studyScheme')
            .where({ organizationId: organization.id })
            .orderBy('studentNumber');

          expect(results.length).to.equal(1);
          expect(results[0].lastName).to.equal('Ishii updated');
          expect(results[0].updatedAt).to.not.deep.equal(new Date('2000-01-01'));
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there is a disabled organization learners for the given organizationId and student number',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('enables the organization-learners', async function () {
          const organization = databaseBuilder.factory.buildOrganization();
          databaseBuilder.factory.buildOrganizationLearner({
            organizationId: organization.id,
            studentNumber: '4',
            isDisabled: true,
          });
          await databaseBuilder.commit();

          const supOrganizationLearner = domainBuilder.buildSupOrganizationLearner({
            organization,
            studentNumber: '4',
          });
          await supOrganizationLearnerRepository.replaceStudents(organization.id, [supOrganizationLearner]);

          const result = await knex('organization-learners')
            .select('isDisabled')
            .where({ organizationId: organization.id })
            .where({ studentNumber: '4' })
            .first();

          expect(result.isDisabled).to.be.false;
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is organization learners for an other organizationId and student number', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('creates the organization-learners', async function () {
        const organization1 = databaseBuilder.factory.buildOrganization();
        const organization2 = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildOrganizationLearner({ organizationId: organization1.id, studentNumber: '4' });
        await databaseBuilder.commit();

        const supOrganizationLearner = domainBuilder.buildSupOrganizationLearner({
          organization: organization2,
          firstName: 'O-Ren',
          lastName: 'Ishii',
          studentNumber: '4',
          birthdate: '1990-07-01',
        });
        await supOrganizationLearnerRepository.replaceStudents(organization2.id, [{ ...supOrganizationLearner }]);

        const results = await knex('organization-learners')
          .select('*', 'status AS studyScheme')
          .where({ organizationId: organization2.id })
          .orderBy('studentNumber');

        expect(results.length).to.equal(1);
        expect(results[0].studentNumber).to.equal('4');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there is an enabled organization learners for the given organizationId which is not updated',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('disables the organization-learners', async function () {
          const organization = databaseBuilder.factory.buildOrganization();
          databaseBuilder.factory.buildOrganizationLearner({
            organizationId: organization.id,
            studentNumber: '4',
            isDisabled: false,
            updatedAt: new Date('2000-01-01'),
          });
          await databaseBuilder.commit();

          const supOrganizationLearner = domainBuilder.buildSupOrganizationLearner({
            organization,
            studentNumber: '5',
          });
          await supOrganizationLearnerRepository.replaceStudents(organization.id, [supOrganizationLearner]);

          const result = await knex('organization-learners')
            .select('isDisabled', 'updatedAt')
            .where({ studentNumber: '4' })
            .first();

          expect(result.isDisabled).to.be.true;
          expect(result.updatedAt).to.not.deep.equal(new Date('2000-01-01'));
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a problem', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not create registrations and does not change existing registrations', async function () {
        const organization = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          studentNumber: '4',
          isDisabled: false,
        });
        await databaseBuilder.commit();

        try {
          await supOrganizationLearnerRepository.replaceStudents(organization.id, [1]);
        } catch (err) {} // eslint-disable-line no-empty

        const result = await knex('organization-learners').select('isDisabled').where({ studentNumber: '4' }).first();

        expect(result.isDisabled).to.be.false;
      });
    });
  });
});
