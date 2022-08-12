// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readFile'.
const { readFile, access } = require('fs').promises;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const { difference, isEmpty, isNumber } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'papa'.
const papa = require('papaparse');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, FileValidationError } = require('../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  INVALID_FILE_EXTENSION: 'INVALID_FILE_EXTENSION',
  MISSING_REQUIRED_FIELD_NAMES: 'MISSING_REQUIRED_FIELD_NAMES',
  MISSING_REQUIRED_FIELD_VALUES: 'MISSING_REQUIRED_FIELD_VALUES',
  EMPTY_FILE: 'EMPTY_FILE',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'optionsWit... Remove this comment to see the full error message
const optionsWithHeader = {
  skipEmptyLines: true,
  header: true,
  transform: (value: $TSFixMe, columnName: $TSFixMe) => {
    if (typeof value === 'string') {
      value = value.trim();
    }
    if (columnName === 'uai') {
      value = value.toUpperCase();
    }
    if (columnName === 'createdBy') {
      value = !isEmpty(value) && parseInt(value, 10);
    }
    return value;
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCsvEx... Remove this comment to see the full error message
function checkCsvExtensionFile(filePath: $TSFixMe) {
  const fileExtension = path.extname(filePath);

  if (fileExtension !== '.csv') {
    throw new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE_EXTENSION, { fileExtension });
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCsvHe... Remove this comment to see the full error message
async function checkCsvHeader({
  filePath,
  requiredFieldNames = []
}: $TSFixMe) {
  if (isEmpty(requiredFieldNames)) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    throw new FileValidationError((ERRORS as $TSFixMe).MISSING_REQUIRED_FIELD_NAMES);
  }

  const options = { ...optionsWithHeader, preview: 1 };
  const data = await parseCsv(filePath, options);
  if (isEmpty(data)) {
    throw new FileValidationError((ERRORS as $TSFixMe).EMPTY_FILE, 'File is empty');
  }

  const fieldNames = Object.keys(data[0]);

  const fieldNamesNotPresent = difference(requiredFieldNames, fieldNames);

  if (!isEmpty(fieldNamesNotPresent)) {
    throw new FileValidationError((ERRORS as $TSFixMe).MISSING_REQUIRED_FIELD_NAMES, `Headers missing: ${fieldNamesNotPresent}`);
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readCsvFil... Remove this comment to see the full error message
async function readCsvFile(filePath: $TSFixMe) {
  try {
    await access(filePath, fs.constants.F_OK);
  } catch (err) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`File ${filePath} not found!`);
  }
  checkCsvExtensionFile(filePath);

  const rawData = await readFile(filePath, 'utf8');

  return rawData.replace(/^\uFEFF/, '');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
async function parseCsv(filePath: $TSFixMe, options: $TSFixMe) {
  const cleanedData = await readCsvFile(filePath);
  return parseCsvData(cleanedData, options);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvDa... Remove this comment to see the full error message
async function parseCsvData(cleanedData: $TSFixMe, options: $TSFixMe) {
  const { data } = papa.parse(cleanedData, options);
  return data;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
function parseCsvWithHeader(filePath: $TSFixMe) {
  return parseCsv(filePath, optionsWithHeader);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
async function parseCsvWithHeaderAndRequiredFields({
  filePath,
  requiredFieldNames
}: $TSFixMe) {
  const csvData: $TSFixMe = [];

  const stepFunction = (results: $TSFixMe, parser: $TSFixMe) => {
    requiredFieldNames.forEach((fieldName: $TSFixMe) => {
      if (!isNumber(results.data[fieldName])) {
        parser.abort();
        throw new FileValidationError((ERRORS as $TSFixMe).MISSING_REQUIRED_FIELD_VALUES, `Field values are required: ${requiredFieldNames}`);
      }
    });
    csvData.push(results.data);
  };
  const options = { ...optionsWithHeader, step: stepFunction };

  await parseCsv(filePath, options);

  return csvData;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  checkCsvExtensionFile,
  checkCsvHeader,
  readCsvFile,
  parseCsvData,
  parseCsv,
  parseCsvWithHeader,
  parseCsvWithHeaderAndRequiredFields,
  optionsWithHeader,
};
