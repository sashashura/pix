// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../domain/models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkValid... Remove this comment to see the full error message
const { checkValidation } = require('../../../domain/validators/organization-learner-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvOrganiz... Remove this comment to see the full error message
const { CsvOrganizationLearnerParser } = require('./csv-learner-parser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError, DomainError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerColumns = require('./organization-learner-columns');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  IDENTIFIER_UNIQUE: 'IDENTIFIER_UNIQUE',
  INSEE_CODE_INVALID: 'INSEE_CODE_INVALID',
};

const sexPossibleValues = {
  M: 'M',
  F: 'F',
};

class OrganizationLearnerSet {
  existingNationalStudentIds: $TSFixMe;
  learners: $TSFixMe;
  constructor() {
    this.learners = [];
    this.existingNationalStudentIds = [];
  }

  addLearner(learnerAttributes: $TSFixMe) {
    checkValidation(learnerAttributes);
    const transformedAttributes = this._transform(learnerAttributes);
    const organizationLearner = new OrganizationLearner(transformedAttributes);
    this.learners.push(organizationLearner);

    this._checkOrganizationLearnersUnicity(organizationLearner);
  }

  _transform(learnerAttributes: $TSFixMe) {
    let sex;
    const { birthCountryCode, nationalIdentifier, division } = learnerAttributes;

    if (learnerAttributes.sex) {
      sex = _convertSexCodeToLabel(learnerAttributes.sex);
    } else {
      sex = null;
    }

    return {
      ...learnerAttributes,
      birthCountryCode: birthCountryCode.slice(-3),
      nationalStudentId: nationalIdentifier,
      division: division?.trim().replace(/\s+/g, ' '),
      sex,
    };
  }

  _checkOrganizationLearnersUnicity(organizationLearner: $TSFixMe) {
    // we removed JOI unicity validation (uniq)
    // because it took too much time (2h30  for 10000 learners)
    // we did the same validation but manually
    if (this.existingNationalStudentIds.includes(organizationLearner.nationalStudentId)) {
      const err = new DomainError();
      err.key = 'nationalIdentifier';
      err.why = 'uniqueness';

      throw err;
    }
    this.existingNationalStudentIds.push(organizationLearner.nationalStudentId);
  }
}

function _convertSexCodeToLabel(sexCode: $TSFixMe) {
  if (sexCode) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return sexPossibleValues[sexCode.toUpperCase().charAt(0)];
  }
  return null;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationLearnerParser extends CsvOrganizationLearnerParser {
  constructor(input: $TSFixMe, organizationId: $TSFixMe, i18n: $TSFixMe) {
    const learnerSet = new OrganizationLearnerSet();

    const columns = new OrganizationLearnerColumns(i18n).columns;

    super(input, organizationId, columns, learnerSet);
  }

  _handleError(err: $TSFixMe, index: $TSFixMe) {
    const column = this._columns.find((column: $TSFixMe) => column.name === err.key);
    const line = index + 2;
    const field = column.label;

    if (err.why === 'uniqueness' && err.key === 'nationalIdentifier') {
      throw new CsvImportError((ERRORS as $TSFixMe).IDENTIFIER_UNIQUE, { line, field });
    }

    if (err.why === 'not_valid_insee_code') {
      throw new CsvImportError((ERRORS as $TSFixMe).INSEE_CODE_INVALID, { line, field });
    }

    // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
    super._handleError(...arguments);
  }

  static buildParser() {
    return new OrganizationLearnerParser(...arguments);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationLearnerParser;
