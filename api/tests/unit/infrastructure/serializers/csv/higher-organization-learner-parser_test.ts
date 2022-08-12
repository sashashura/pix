// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerParser = require('../../../../../lib/infrastructure/serializers/csv/sup-organization-learner-parser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerColumns = require('../../../../../lib/infrastructure/serializers/csv/sup-organization-learner-columns');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../../tooling/i18n/i18n');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = getI18n();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supOrganiz... Remove this comment to see the full error message
const supOrganizationLearnerColumns = new SupOrganizationLearnerColumns(i18n).columns
  .map((column: $TSFixMe) => column.label)
  .join(';');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | SupOrganizationLearnerParser', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the header is correctly formed', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no line', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns an empty SupOrganizationLearnerSet', function () {
        const input = supOrganizationLearnerColumns;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new SupOrganizationLearnerParser(encodedInput, 123, i18n);

        const supOrganizationLearnerSet = parser.parse();

        expect(supOrganizationLearnerSet.learners).to.be.empty;
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lines', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns a SupOrganizationLearnerSet with organization learner for each line', function () {
        const input = `${supOrganizationLearnerColumns}
        Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;12346;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend;
        O-Ren;;;Ishii;Cottonmouth;01/01/1980;ishii@example.net;789;Assassination Squad;Bill;Deadly Viper Assassination Squad;DUT;;
        `;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new SupOrganizationLearnerParser(encodedInput, 456, i18n);

        const supOrganizationLearnerSet = parser.parse();
        const learners = supOrganizationLearnerSet.learners;
        expect(learners).to.have.lengthOf(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns a SupOrganizationLearnerSet with an organization learner for each line using the CSV column', function () {
        const input = `${supOrganizationLearnerColumns}
        Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123456;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Autre;Autre;
        O-Ren;;;Ishii;Cottonmouth;01/01/1980;ishii@example.net;789;Assassination Squad;Bill;Deadly Viper Assassination Squad;DUT contrôlé par l'Etat;Autre;
        `;
        const organizationId = 789;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new SupOrganizationLearnerParser(encodedInput, organizationId, i18n);
        const supOrganizationLearnerSet = parser.parse();
        const learners = _.sortBy(supOrganizationLearnerSet.learners, 'preferredLastName');
        expect(learners[0]).to.deep.equal({
          firstName: 'Beatrix',
          middleName: 'The',
          thirdName: 'Bride',
          lastName: 'Kiddo',
          preferredLastName: 'Black Mamba',
          studentNumber: '123456',
          email: 'thebride@example.net',
          birthdate: '1970-01-01',
          diploma: 'Autre',
          department: 'Assassination Squad',
          educationalTeam: 'Hattori Hanzo',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'Autre',
          organizationId,
        });
        expect(learners[1]).to.deep.equal({
          firstName: 'O-Ren',
          middleName: undefined,
          thirdName: undefined,
          lastName: 'Ishii',
          preferredLastName: 'Cottonmouth',
          studentNumber: '789',
          email: 'ishii@example.net',
          birthdate: '1980-01-01',
          diploma: "DUT contrôlé par l'Etat",
          department: 'Assassination Squad',
          educationalTeam: 'Bill',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'Autre',
          organizationId,
        });
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When a column value does not match requirements', function () {
    const organizationId = 123;

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the student number is not unique', async function () {
      const input = `${supOrganizationLearnerColumns}
      Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend;
      Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend;`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new SupOrganizationLearnerParser(encodedInput, organizationId, i18n);

      const error = await catchErr(parser.parse, parser)();

      expect((error as $TSFixMe).code).to.equal('STUDENT_NUMBER_UNIQUE');
      expect((error as $TSFixMe).meta).to.deep.equal({ line: 3, field: 'Numéro étudiant' });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the student number is has an incorrect  format', async function () {
      const input = `${supOrganizationLearnerColumns}
      Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;thebride@example.net;123@;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend;
      Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1971;thebride@example.net;1234;Assassination Squad;Hattori Hanzo;Deadly Viper Assassination Squad;Master;hello darkness my old friend;`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new SupOrganizationLearnerParser(encodedInput, organizationId, i18n);

      const error = await catchErr(parser.parse, parser)();

      expect((error as $TSFixMe).code).to.equal('STUDENT_NUMBER_FORMAT');
      expect((error as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'Numéro étudiant' });
    });
  });
});
