// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const XLSX = require('xlsx');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unprocessa... Remove this comment to see the full error message
const { UnprocessableEntityError } = require('../../../application/http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'loadOdsZip... Remove this comment to see the full error message
const { loadOdsZip } = require('./common-ods-utils');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CONTENT_XM... Remove this comment to see the full error message
const CONTENT_XML_IN_ODS = 'content.xml';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getContent... Remove this comment to see the full error message
async function getContentXml({
  odsFilePath
}: $TSFixMe) {
  const zip = await loadOdsZip(odsFilePath);
  const contentXmlBufferCompressed = zip.file(CONTENT_XML_IN_ODS);
  const uncompressedBuffer = await contentXmlBufferCompressed.async('nodebuffer');
  return Buffer.from(uncompressedBuffer, 'utf8').toString();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractTab... Remove this comment to see the full error message
async function extractTableDataFromOdsFile({
  odsBuffer,
  tableHeaderTargetPropertyMap
}: $TSFixMe) {
  const sheetDataRows = await getSheetDataRowsFromOdsBuffer({ odsBuffer });
  const tableHeaders = _.map(tableHeaderTargetPropertyMap, 'header');
  const sheetHeaderRow = _findHeaderRow(sheetDataRows, tableHeaders);
  if (!sheetHeaderRow) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('Table headers not found');
  }
  const sheetDataRowsBelowHeader = _extractRowsBelowHeader(sheetHeaderRow, sheetDataRows);
  const sheetHeaderPropertyMap = _mapSheetHeadersWithProperties(sheetHeaderRow, tableHeaderTargetPropertyMap);

  const dataByLine = _transformSheetDataRows(sheetDataRowsBelowHeader, sheetHeaderPropertyMap);
  if (_.isEmpty(dataByLine)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('No data in table');
  }

  return dataByLine;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateOd... Remove this comment to see the full error message
async function validateOdsHeaders({
  odsBuffer,
  headers
}: $TSFixMe) {
  const sheetDataRows = await getSheetDataRowsFromOdsBuffer({ odsBuffer });
  const headerRow = _findHeaderRow(sheetDataRows, headers);

  if (!headerRow) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('Unknown attendance sheet version');
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSheetDa... Remove this comment to see the full error message
async function getSheetDataRowsFromOdsBuffer({
  odsBuffer,
  jsonOptions = { header: 'A' }
}: $TSFixMe) {
  let document;
  try {
    document = await XLSX.read(odsBuffer, { type: 'buffer', cellDates: true });
  } catch (error) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError(error);
  }
  const sheet = document.Sheets[document.SheetNames[0]];
  const sheetDataRows = XLSX.utils.sheet_to_json(sheet, jsonOptions);
  if (_.isEmpty(sheetDataRows)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new UnprocessableEntityError('Empty data in sheet');
  }
  return sheetDataRows;
}

function _extractRowsBelowHeader(sheetHeaderRow: $TSFixMe, sheetDataRows: $TSFixMe) {
  const headerIndex = _.findIndex(sheetDataRows, (row: $TSFixMe) => _.isEqual(row, sheetHeaderRow));
  return _takeRightUntilIndex({ array: sheetDataRows, index: headerIndex + 1 });
}

function _takeRightUntilIndex({
  array,
  index
}: $TSFixMe) {
  const countElementsToTake = _.size(array) - index;
  return _.takeRight(array, countElementsToTake);
}

function _findHeaderRow(sheetDataRows: $TSFixMe, tableHeaders: $TSFixMe) {
  return _.find(sheetDataRows, (row: $TSFixMe) => _allHeadersValuesAreInTheRow(row, tableHeaders));
}

function _allHeadersValuesAreInTheRow(row: $TSFixMe, headers: $TSFixMe) {
  const cellValuesInRow = _.values(row);
  const strippedCellValuesInRow = _.map(cellValuesInRow, _removeNewlineCharacters);
  const strippedHeaders = _.map(headers, _removeNewlineCharacters);
  const headersInRow = _.intersection(strippedCellValuesInRow, strippedHeaders);
  return headersInRow.length === headers.length;
}

function _removeNewlineCharacters(header: $TSFixMe) {
  return _.isString(header) ? header.replace(/[\n\r]/g, '') : header;
}

function _mapSheetHeadersWithProperties(sheetHeaderRow: $TSFixMe, tableHeaderTargetPropertyMap: $TSFixMe) {
  return _(sheetHeaderRow).map(_addTargetDatas(tableHeaderTargetPropertyMap)).compact().value();
}

function _findTargetPropertiesByHeader(tableHeaderTargetPropertyMap: $TSFixMe, header: $TSFixMe) {
  const mapWithSanitizedHeaders = _.map(tableHeaderTargetPropertyMap, (obj: $TSFixMe) => ({
    ...obj,
    header: _removeNewlineCharacters(obj.header)
  }));

  return _.find(mapWithSanitizedHeaders, { header: _removeNewlineCharacters(header) });
}

function _addTargetDatas(tableHeaderTargetPropertyMap: $TSFixMe) {
  return (header: $TSFixMe, columnName: $TSFixMe) => {
    const targetProperties = _findTargetPropertiesByHeader(tableHeaderTargetPropertyMap, header);
    if (targetProperties) {
      const { property: targetProperty, transformFn } = targetProperties;
      return { columnName, targetProperty, transformFn };
    }
  };
}

function _transformSheetDataRows(sheetDataRows: $TSFixMe, sheetHeaderPropertyMap: $TSFixMe) {
  const dataByLine = {};
  for (const sheetDataRow of sheetDataRows) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    dataByLine[sheetDataRow['__rowNum__']] = _transformSheetDataRow(sheetDataRow, sheetHeaderPropertyMap);
  }
  return dataByLine;
}

function _transformSheetDataRow(sheetDataRow: $TSFixMe, sheetHeaderPropertyMap: $TSFixMe) {
  return _.reduce(
    sheetHeaderPropertyMap,
    (target: $TSFixMe, {
      columnName,
      targetProperty,
      transformFn
    }: $TSFixMe) => {
      const cellValue = sheetDataRow[columnName];
      target[targetProperty] = transformFn(cellValue);
      return target;
    },
    {}
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractTableDataFromOdsFile,
  getContentXml,
  getSheetDataRowsFromOdsBuffer,
  validateOdsHeaders,
};
