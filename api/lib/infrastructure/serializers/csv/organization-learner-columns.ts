// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvColumn'... Remove this comment to see the full error message
const { CsvColumn } = require('./csv-learner-parser');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationLearnerColumns {
  columns: $TSFixMe;
  translate: $TSFixMe;
  constructor(i18n: $TSFixMe) {
    this.translate = i18n.__;
    this.columns = this.setColumns();
  }

  setColumns() {
    return [
      new CsvColumn({
        name: 'nationalIdentifier',
        label: this.translate('csv-template.organization-learners.national-identifier'),
        isRequired: true,
      }),
      new CsvColumn({
        name: 'firstName',
        label: this.translate('csv-template.organization-learners.first-name'),
        isRequired: true,
        checkEncoding: true,
      }),
      new CsvColumn({ name: 'middleName', label: this.translate('csv-template.organization-learners.middle-name') }),
      new CsvColumn({ name: 'thirdName', label: this.translate('csv-template.organization-learners.third-name') }),
      new CsvColumn({
        name: 'lastName',
        label: this.translate('csv-template.organization-learners.last-name'),
        isRequired: true,
      }),
      new CsvColumn({
        name: 'preferredLastName',
        label: this.translate('csv-template.organization-learners.preferred-last-name'),
      }),
      new CsvColumn({
        name: 'sex',
        label: this.translate('csv-template.organization-learners.sex'),
        isRequired: false,
      }),
      new CsvColumn({
        name: 'birthdate',
        label: this.translate('csv-template.organization-learners.birthdate'),
        isRequired: true,
        isDate: true,
      }),
      new CsvColumn({
        name: 'birthCityCode',
        label: this.translate('csv-template.organization-learners.birth-city-code'),
      }),
      new CsvColumn({ name: 'birthCity', label: this.translate('csv-template.organization-learners.birth-city') }),
      new CsvColumn({
        name: 'birthProvinceCode',
        label: this.translate('csv-template.organization-learners.birth-province-code'),
        isRequired: true,
      }),
      new CsvColumn({
        name: 'birthCountryCode',
        label: this.translate('csv-template.organization-learners.birth-country-code'),
        isRequired: true,
      }),
      new CsvColumn({
        name: 'status',
        label: this.translate('csv-template.organization-learners.status'),
        isRequired: true,
      }),
      new CsvColumn({
        name: 'MEFCode',
        label: this.translate('csv-template.organization-learners.mef-code'),
        isRequired: true,
      }),
      new CsvColumn({
        name: 'division',
        label: this.translate('csv-template.organization-learners.division'),
        isRequired: true,
      }),
    ];
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationLearnerColumns;
