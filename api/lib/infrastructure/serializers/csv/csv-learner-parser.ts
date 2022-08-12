// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'papa'.
const papa = require('papaparse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'convertDat... Remove this comment to see the full error message
const { convertDateValue } = require('../../utils/date-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError } = require('../../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  ENCODING_NOT_SUPPORTED: 'ENCODING_NOT_SUPPORTED',
  BAD_CSV_FORMAT: 'BAD_CSV_FORMAT',
  HEADER_REQUIRED: 'HEADER_REQUIRED',
  HEADER_UNKNOWN: 'HEADER_UNKNOWN',
  FIELD_MIN_LENGTH: 'FIELD_MIN_LENGTH',
  FIELD_MAX_LENGTH: 'FIELD_MAX_LENGTH',
  FIELD_LENGTH: 'FIELD_LENGTH',
  FIELD_DATE_FORMAT: 'FIELD_DATE_FORMAT',
  FIELD_EMAIL_FORMAT: 'FIELD_EMAIL_FORMAT',
  FIELD_REQUIRED: 'FIELD_REQUIRED',
  FIELD_BAD_VALUES: 'FIELD_BAD_VALUES',
};

const PARSING_OPTIONS = {
  header: true,
  skipEmptyLines: 'greedy',
  transform: (value: $TSFixMe) => {
    if (typeof value === 'string') {
      value = value.trim();
      return value.length ? value : undefined;
    }
    return value;
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvColumn'... Remove this comment to see the full error message
class CsvColumn {
  checkEncoding: $TSFixMe;
  isDate: $TSFixMe;
  isRequired: $TSFixMe;
  label: $TSFixMe;
  name: $TSFixMe;
  constructor({
    name,
    label,
    isRequired = false,
    isDate = false,
    checkEncoding = false
  }: $TSFixMe) {
    this.name = name;
    this.label = label;
    this.isRequired = isRequired;
    this.isDate = isDate;
    this.checkEncoding = checkEncoding;
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvOrganiz... Remove this comment to see the full error message
class CsvOrganizationLearnerParser {
  _columns: $TSFixMe;
  _input: $TSFixMe;
  _organizationId: $TSFixMe;
  learnerSet: $TSFixMe;
  constructor(input: $TSFixMe, organizationId: $TSFixMe, columns: $TSFixMe, learnerSet: $TSFixMe) {
    this._input = input;
    this._organizationId = organizationId;
    this._columns = columns;
    this.learnerSet = learnerSet;
  }

  parse() {
    const encoding = this._getFileEncoding();
    const { learnerLines, fields } = this._parse(encoding);

    if (!encoding) {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      throw new CsvImportError((ERRORS as $TSFixMe).ENCODING_NOT_SUPPORTED);
    }

    this._checkColumns(fields);
    learnerLines.forEach((line: $TSFixMe, index: $TSFixMe) => {
      const learnerAttributes = this._lineToOrganizationLearnerAttributes(line);
      try {
        this.learnerSet.addLearner(learnerAttributes);
      } catch (err) {
        this._handleError(err, index);
      }
    });
    return this.learnerSet;
  }

  /**
   * Identify which encoding has the given file.
   * To check it, we decode and parse the first line of the file with supported encodings.
   * If there is one with at least "First name" or "Student number" correctly parsed and decoded.
   */
  _getFileEncoding() {
    const supported_encodings = ['utf-8', 'win1252', 'macintosh'];
    const checkedColumns = this._getEncodingColumns();
    for (const encoding of supported_encodings) {
      const decodedInput = iconv.decode(this._input, encoding);
      const {
        meta: { fields },
      } = papa.parse(decodedInput, { ...PARSING_OPTIONS, preview: 1 });
      if (fields.some((value: $TSFixMe) => checkedColumns.includes(value))) {
        return encoding;
      }
    }
  }

  _getEncodingColumns() {
    const checkedColumns = this._columns.filter((c: $TSFixMe) => c.checkEncoding).map((c: $TSFixMe) => c.label);
    if (checkedColumns.length === 0) {
      return this._columns.map((c: $TSFixMe) => c.label);
    }
    return checkedColumns;
  }

  _parse(encoding = 'utf8') {
    const decodedInput = iconv.decode(this._input, encoding);
    const {
      data: learnerLines,
      meta: { fields },
      errors,
    } = papa.parse(decodedInput, PARSING_OPTIONS);

    if (errors.length) {
      const hasDelimiterError = errors.some((error: $TSFixMe) => error.type === 'Delimiter');
      if (hasDelimiterError) {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        throw new CsvImportError((ERRORS as $TSFixMe).BAD_CSV_FORMAT);
      }
    }

    return { learnerLines, fields };
  }

  _lineToOrganizationLearnerAttributes(line: $TSFixMe) {
    const learnerAttributes = {
      organizationId: this._organizationId,
    };

    this._columns.forEach((column: $TSFixMe) => {
      const value = line[column.label];
      if (column.isDate) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        learnerAttributes[column.name] = this._buildDateAttribute(value);
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        learnerAttributes[column.name] = value;
      }
    });

    return learnerAttributes;
  }

  _checkColumns(parsedColumns: $TSFixMe) {
    // Required columns
    const missingMandatoryColumn = this._columns
      .filter((c: $TSFixMe) => c.isRequired)
      .find((c: $TSFixMe) => !parsedColumns.includes(c.label));

    if (missingMandatoryColumn) {
      throw new CsvImportError((ERRORS as $TSFixMe).HEADER_REQUIRED, { field: missingMandatoryColumn.label });
    }

    // Expected columns
    const acceptedColumns = this._columns.map((column: $TSFixMe) => column.label);

    if (_atLeastOneParsedColumnDoesNotMatchAcceptedColumns(parsedColumns, acceptedColumns)) {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      throw new CsvImportError((ERRORS as $TSFixMe).HEADER_UNKNOWN);
    }
  }

  _buildDateAttribute(dateString: $TSFixMe) {
    const convertedDate = convertDateValue({
      dateString,
      inputFormat: 'DD/MM/YYYY',
      alternativeInputFormat: 'DD/MM/YY',
      outputFormat: 'YYYY-MM-DD',
    });
    return convertedDate || dateString;
  }

  _handleError(err: $TSFixMe, index: $TSFixMe) {
    const column = this._columns.find((column: $TSFixMe) => column.name === err.key);
    const line = index + 2;
    const field = column.label;
    if (err.why === 'min_length') {
      throw new CsvImportError((ERRORS as $TSFixMe).FIELD_MIN_LENGTH, { line, field, limit: err.limit });
    }
    if (err.why === 'max_length') {
      throw new CsvImportError((ERRORS as $TSFixMe).FIELD_MAX_LENGTH, { line, field, limit: err.limit });
    }
    if (err.why === 'length') {
      throw new CsvImportError((ERRORS as $TSFixMe).FIELD_LENGTH, { line, field, limit: err.limit });
    }
    if (err.why === 'date_format' || err.why === 'not_a_date') {
      throw new CsvImportError((ERRORS as $TSFixMe).FIELD_DATE_FORMAT, { line, field });
    }
    if (err.why === 'email_format') {
      throw new CsvImportError((ERRORS as $TSFixMe).FIELD_EMAIL_FORMAT, { line, field });
    }
    if (err.why === 'required') {
      throw new CsvImportError((ERRORS as $TSFixMe).FIELD_REQUIRED, { line, field });
    }
    if (err.why === 'bad_values') {
      throw new CsvImportError((ERRORS as $TSFixMe).FIELD_BAD_VALUES, { line, field, valids: err.valids });
    }
    throw err;
  }
}

function _atLeastOneParsedColumnDoesNotMatchAcceptedColumns(parsedColumns: $TSFixMe, acceptedColumns: $TSFixMe) {
  return parsedColumns.some((parsedColumn: $TSFixMe) => {
    if (parsedColumn !== '') {
      return !acceptedColumns.includes(parsedColumn);
    }
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CsvColumn,
  CsvOrganizationLearnerParser,
};
