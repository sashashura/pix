// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../infrastructure/logger');

function _csvFormulaEscapingPrefix(data: $TSFixMe) {
  const mayBeInterpretedAsFormula = /^[-@=+]/.test(data);
  return mayBeInterpretedAsFormula ? "'" : '';
}

function _csvSerializeValue(data: $TSFixMe) {
  if (typeof data === 'number') {
    return data.toString().replace(/\./, ',');
  } else if (typeof data === 'string') {
    if (/^[0-9-]+$/.test(data)) {
      return data;
    } else {
      return `"${_csvFormulaEscapingPrefix(data)}${data.replace(/"/g, '""')}"`;
    }
  } else {
    logger.error(`Unknown value type in _csvSerializeValue: ${typeof data}: ${data}`);
    return '""';
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeLine(lineArray: $TSFixMe) {
    return lineArray.map(_csvSerializeValue).join(';') + '\n';
  },
};
