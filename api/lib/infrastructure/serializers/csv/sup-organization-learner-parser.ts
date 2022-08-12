// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerSet = require('../../../domain/models/SupOrganizationLearnerSet');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError } = require('../../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvOrganiz... Remove this comment to see the full error message
const { CsvOrganizationLearnerParser } = require('./csv-learner-parser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearnerColumns = require('./sup-organization-learner-columns');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  STUDENT_NUMBER_UNIQUE: 'STUDENT_NUMBER_UNIQUE',
  STUDENT_NUMBER_FORMAT: 'STUDENT_NUMBER_FORMAT',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
class SupOrganizationLearnerParser extends CsvOrganizationLearnerParser {
  constructor(input: $TSFixMe, organizationId: $TSFixMe, i18n: $TSFixMe) {
    const LearnerSet = new SupOrganizationLearnerSet(i18n);

    const columns = new SupOrganizationLearnerColumns(i18n).columns;

    super(input, organizationId, columns, LearnerSet);
  }

  _handleError(err: $TSFixMe, index: $TSFixMe) {
    const column = this._columns.find((column: $TSFixMe) => column.name === err.key);
    const line = index + 2;
    const field = column.label;
    if (err.why === 'uniqueness') {
      throw new CsvImportError((ERRORS as $TSFixMe).STUDENT_NUMBER_UNIQUE, { line, field });
    }
    if (err.why === 'student_number_format') {
      throw new CsvImportError((ERRORS as $TSFixMe).STUDENT_NUMBER_FORMAT, { line, field });
    }
    // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
    super._handleError(...arguments);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SupOrganizationLearnerParser;
