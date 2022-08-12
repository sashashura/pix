// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvColumn'... Remove this comment to see the full error message
const { CsvColumn } = require('./csv-learner-parser');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
class SupOrganizationLearnerColumns {
  columns: $TSFixMe;
  translate: $TSFixMe;
  constructor(i18n: $TSFixMe) {
    this.translate = i18n.__;
    this.columns = this.setColumns();
  }

  setColumns() {
    return [
      new CsvColumn({
        name: 'firstName',
        label: this.translate('csv-template.sup-organization-learners.first-name'),
        isRequired: true,
        checkEncoding: true,
      }),
      new CsvColumn({
        name: 'middleName',
        label: this.translate('csv-template.sup-organization-learners.middle-name'),
      }),
      new CsvColumn({
        name: 'thirdName',
        label: this.translate('csv-template.sup-organization-learners.third-name'),
      }),
      new CsvColumn({
        name: 'lastName',
        label: this.translate('csv-template.sup-organization-learners.last-name'),
        isRequired: true,
      }),
      new CsvColumn({
        name: 'preferredLastName',
        label: this.translate('csv-template.sup-organization-learners.preferred-lastname'),
      }),
      new CsvColumn({
        name: 'birthdate',
        label: this.translate('csv-template.sup-organization-learners.birthdate'),
        isRequired: true,
        isDate: true,
      }),
      new CsvColumn({ name: 'email', label: this.translate('csv-template.sup-organization-learners.email') }),
      new CsvColumn({
        name: 'studentNumber',
        label: this.translate('csv-template.sup-organization-learners.student-number'),
        isRequired: true,
        checkEncoding: true,
      }),
      new CsvColumn({
        name: 'department',
        label: this.translate('csv-template.sup-organization-learners.department'),
      }),
      new CsvColumn({
        name: 'educationalTeam',
        label: this.translate('csv-template.sup-organization-learners.educational-team'),
      }),
      new CsvColumn({ name: 'group', label: this.translate('csv-template.sup-organization-learners.group') }),
      new CsvColumn({ name: 'diploma', label: this.translate('csv-template.sup-organization-learners.diploma') }),
      new CsvColumn({
        name: 'studyScheme',
        label: this.translate('csv-template.sup-organization-learners.study-scheme'),
      }),
    ];
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SupOrganizationLearnerColumns;
