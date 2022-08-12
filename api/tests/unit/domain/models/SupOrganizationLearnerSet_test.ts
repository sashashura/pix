// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerSet = require('../../../../lib/domain/models/SupOrganizationLearnerSet');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | SupOrganizationLearnerSet', function () {
  let i18n: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    i18n = getI18n();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#addLearner', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when set has no learner', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('creates the first learner of the set', function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learnerAttributes = {
          firstName: 'Beatrix',
          middleName: 'The',
          thirdName: 'Bride',
          lastName: 'Kiddo',
          preferredLastName: 'Black Mamba',
          studentNumber: '1',
          email: 'thebride@example.net',
          birthdate: new Date('1980-07-01'),
          diploma: 'Autre',
          department: 'Assassination Squad',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'Autre',
          organizationId: 1,
        };

        supOrganizationLearnerSet.addLearner(learnerAttributes);
        const learners = supOrganizationLearnerSet.learners;

        expect(learners).to.have.lengthOf(1);
        expect(learners[0]).to.deep.equal(learnerAttributes);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when set has learners', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('creates the a new learner for the set', function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner1 = {
          firstName: 'Beatrix',
          middleName: 'The',
          thirdName: 'Bride',
          lastName: 'Kiddo',
          preferredLastName: 'Black Mamba',
          studentNumber: '1',
          email: 'thebride@example.net',
          birthdate: new Date('1980-07-01'),
          diploma: 'Autre',
          department: 'Assassination Squad',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'Autre',
          userId: 12345,
          organizationId: 1,
        };
        const learner2 = {
          firstName: 'Bill',
          middleName: 'Unknown',
          thirdName: 'Unknown',
          lastName: 'Unknown',
          preferredLastName: 'Snake Charmer',
          studentNumber: '2',
          email: 'bill@example.net',
          birthdate: new Date('1960-07-01'),
          diploma: 'Autre',
          department: 'Assassination Squad Management',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'Autre',
          organizationId: 2,
        };

        supOrganizationLearnerSet.addLearner(learner1);
        supOrganizationLearnerSet.addLearner(learner2);
        const learners = supOrganizationLearnerSet.learners;

        expect(learners).to.have.lengthOf(2);
        expect(learners[1]).to.deep.equal(learner2);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a learner is not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner = {
          firstName: null,
          lastName: 'Kiddo',
          birthdate: new Date('1980-07-01'),
        };

        const addLearner = supOrganizationLearnerSet.addLearner.bind(supOrganizationLearnerSet);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(addLearner)(learner);

        expect(error).to.be.instanceOf(EntityValidationError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a learner with the same student number', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner1 = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
        };
        const learner2 = {
          firstName: 'Ishii',
          lastName: 'O-ren',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
        };
        await supOrganizationLearnerSet.addLearner(learner1);

        const error = await catchErr(supOrganizationLearnerSet.addLearner, supOrganizationLearnerSet)(learner2);

        expect(error).to.be.instanceOf(EntityValidationError);
        expect((error as $TSFixMe).key).to.equal('studentNumber');
        expect((error as $TSFixMe).why).to.equal('uniqueness');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are warnings', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should add a diploma warning', async function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
          diploma: 'BAD',
          studyScheme: 'Autre',
        };

        supOrganizationLearnerSet.addLearner(learner);
        const { learners, warnings } = supOrganizationLearnerSet;

        expect(learners).to.have.lengthOf(1);
        expect(learners[0].diploma).to.equal('Non reconnu');
        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.deep.equal({ studentNumber: '123ABC', field: 'diploma', value: 'BAD', code: 'unknown' });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should add a study scheme warning', async function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
          diploma: 'Autre',
          studyScheme: 'BAD',
        };

        supOrganizationLearnerSet.addLearner(learner);
        const { learners, warnings } = supOrganizationLearnerSet;

        expect(learners).to.have.lengthOf(1);
        expect(learners[0].studyScheme).to.equal('Non reconnu');
        expect(warnings).to.have.lengthOf(1);
        expect(warnings[0]).to.deep.equal({
          studentNumber: '123ABC',
          field: 'study-scheme',
          value: 'BAD',
          code: 'unknown',
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should check diplomas and study schemes with lower case', async function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
          diploma: 'aUTRe',
          studyScheme: 'aUTRe',
        };

        supOrganizationLearnerSet.addLearner(learner);
        const { learners, warnings } = supOrganizationLearnerSet;

        expect(learners).to.have.lengthOf(1);
        expect(warnings).to.have.lengthOf(0);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should check diplomas and study schemes with Levenshtein distance', async function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
          diploma: 'Autra',
          studyScheme: 'Autra',
        };

        supOrganizationLearnerSet.addLearner(learner);
        const { learners, warnings } = supOrganizationLearnerSet;

        expect(learners).to.have.lengthOf(1);
        expect(warnings).to.have.lengthOf(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When group has spaces', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should trim group', async function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const organizationLearner = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
          diploma: 'BAD',
          studyScheme: 'Autre',
          group: ' some group ',
        };

        supOrganizationLearnerSet.addLearner(organizationLearner);
        const { learners } = supOrganizationLearnerSet;

        expect(learners[0].group).to.equal('some group');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should remove extra space on group', function () {
        const supOrganizationLearnerSet = new SupOrganizationLearnerSet(i18n);
        const learner = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1990-04-01',
          studentNumber: '123ABC',
          organizationId: 123,
          diploma: 'BAD',
          studyScheme: 'Autre',
          group: 'some        group',
        };

        supOrganizationLearnerSet.addLearner(learner);
        const { learners } = supOrganizationLearnerSet;

        expect(learners[0].group).to.equal('some group');
      });
    });
  });
});
