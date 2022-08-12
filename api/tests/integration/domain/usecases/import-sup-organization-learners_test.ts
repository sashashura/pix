// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const importSupOrganizationLearner = require('../../../../lib/domain/usecases/import-sup-organization-learners');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerRepository = require('../../../../lib/infrastructure/repositories/sup-organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerParser = require('../../../../lib/infrastructure/serializers/csv/sup-organization-learner-parser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerColumns = require('../../../../lib/infrastructure/serializers/csv/sup-organization-learner-columns');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = getI18n();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerColumns = new SupOrganizationLearnerColumns(i18n).columns
  .map((column: $TSFixMe) => column.label)
  .join(';');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | ImportSupOrganizationLearner', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    return knex('organization-learners').delete();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is no organization learners for the organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('parses the csv received and creates the SupOrganizationLearner', async function () {
      const input = `${supOrganizationLearnerColumns}
          Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;12346;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend;
          O-Ren;;;Ishii;Cottonmouth;01/01/1980;ishii@example.net;789;Assassination Squad;Bill;Deadly Viper Assassination Squad;DUT;;
      `.trim();

      const encodedInput = iconv.encode(input, 'utf8');

      const organization = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();
      await importSupOrganizationLearner({
        organizationId: organization.id,
        supOrganizationLearnerRepository,
        supOrganizationLearnerParser: new SupOrganizationLearnerParser(encodedInput, organization.id, i18n),
      });

      const learners = await knex('organization-learners').where({ organizationId: organization.id });
      expect(learners).to.have.lengthOf(2);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is an organization learner for the organization', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('which matches by student number', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('updates the existing organization learner which have matched with csv data', async function () {
        const input = `${supOrganizationLearnerColumns}
            Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123456;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend;
        `.trim();

        const encodedInput = iconv.encode(input, 'utf8');

        const organization = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: organization.id,
          studentNumber: '123456',
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: '1970-01-01',
          email: 'old.email@dva.com',
        });

        await databaseBuilder.commit();
        await importSupOrganizationLearner({
          organizationId: organization.id,
          supOrganizationLearnerRepository,
          supOrganizationLearnerParser: new SupOrganizationLearnerParser(encodedInput, organization.id, i18n),
        });

        const [learner] = await knex('organization-learners').where({ organizationId: organization.id });
        expect(learner.email).to.equal('thebride@example.net');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return warnings about the import', async function () {
    const input = `${supOrganizationLearnerColumns}
            Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123456;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;BAD;BAD;
        `.trim();

    const encodedInput = iconv.encode(input, 'utf8');
    const organization = databaseBuilder.factory.buildOrganization();
    await databaseBuilder.commit();

    const warnings = await importSupOrganizationLearner({
      organizationId: organization.id,
      supOrganizationLearnerRepository,
      supOrganizationLearnerParser: new SupOrganizationLearnerParser(encodedInput, organization.id, i18n),
    });

    expect(warnings).to.deep.equal([
      { studentNumber: '123456', field: 'study-scheme', value: 'BAD', code: 'unknown' },
      { studentNumber: '123456', field: 'diploma', value: 'BAD', code: 'unknown' },
    ]);
  });
});
