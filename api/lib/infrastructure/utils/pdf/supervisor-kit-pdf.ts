// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PDFDocumen... Remove this comment to see the full error message
const { PDFDocument, rgb } = require('pdf-lib');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readFile'.
const { readFile } = require('fs/promises');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pdfLibFont... Remove this comment to see the full error message
const pdfLibFontkit = require('@pdf-lib/fontkit');
const MAX_SESSION_DETAIL_WIDTH = 155;
const SESSION_DETAIL_FONT_SIZE = 7;
const SESSION_DETAIL_LINE_HEIGHT = 8;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSupervi... Remove this comment to see the full error message
async function getSupervisorKitPdfBuffer({
  sessionForSupervisorKit,
  // @ts-expect-error TS(2552): Cannot find name '__dirname'. Did you mean 'dirnam... Remove this comment to see the full error message
  dirname = __dirname,
  fontkit = pdfLibFontkit,
  creationDate = new Date()
}: $TSFixMe = {}) {
  const fileBuffer = await readFile(`${dirname}/files/kit-surveillant_template.pdf`);

  const pdfDoc = await PDFDocument.load(fileBuffer);

  pdfDoc.setCreationDate(creationDate);
  pdfDoc.setModificationDate(creationDate);

  pdfDoc.registerFontkit(fontkit);

  const fontFile = await readFile(`${dirname}/files/Roboto-Medium.ttf`);
  const robotFont = await pdfDoc.embedFont(fontFile, { subset: true, customName: 'Roboto-Medium.ttf' });

  const [page] = pdfDoc.getPages();

  _drawSessionDate(sessionForSupervisorKit, page, robotFont);
  _drawSessionStartTime(sessionForSupervisorKit, page, robotFont);
  _drawSessionAddress(sessionForSupervisorKit, page, robotFont);
  _drawSessionExaminer(sessionForSupervisorKit, page, robotFont);
  _drawSessionRoom(sessionForSupervisorKit, page, robotFont);
  _drawSessionId(sessionForSupervisorKit, page, robotFont);
  _drawSupervisorPassword(sessionForSupervisorKit, page, robotFont);
  _drawAccessCode(sessionForSupervisorKit, page, robotFont);

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  const fileName = `kit-surveillant-${sessionForSupervisorKit.id}.pdf`;

  return {
    buffer,
    fileName,
  };
}

function _drawSessionDate(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const date = new Date(sessionForSupervisorKit.date);
  const day = date.getDate();
  const year = date.getFullYear();
  const options = { month: 'short' };
  // @ts-expect-error TS(2345): Argument of type '{ month: string; }' is not assig... Remove this comment to see the full error message
  const month = new Intl.DateTimeFormat('fr-FR', options).format(date);

  const fullDate = day + ' ' + month + ' ' + year;
  page.drawText(fullDate, {
    x: 85,
    y: 646,
    size: SESSION_DETAIL_FONT_SIZE,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawSessionStartTime(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const [hours, minutes] = sessionForSupervisorKit.time.split(':');
  const hour = `${hours}h${minutes}`;
  page.drawText(hour, {
    x: 182,
    y: 646,
    size: SESSION_DETAIL_FONT_SIZE,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawSessionAddress(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const addressArray = _toArrayOfFixedWidthConservingWords(
    sessionForSupervisorKit.address,
    font,
    MAX_SESSION_DETAIL_WIDTH
  );
  // @ts-expect-error TS(7006): Parameter 'address' implicitly has an 'any' type.
  addressArray.forEach((address, index) => {
    page.drawText(address, {
      x: 60,
      y: 616 - index * SESSION_DETAIL_LINE_HEIGHT,
      size: SESSION_DETAIL_FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function _drawSessionRoom(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const roomArray = _toArrayOfFixedWidthConservingWords(sessionForSupervisorKit.room, font, MAX_SESSION_DETAIL_WIDTH);
  // @ts-expect-error TS(7006): Parameter 'room' implicitly has an 'any' type.
  roomArray.forEach((room, index) => {
    page.drawText(room, {
      x: 60,
      y: 584 - index * SESSION_DETAIL_LINE_HEIGHT,
      size: SESSION_DETAIL_FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function _drawSessionExaminer(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const examinerArray = _toArrayOfFixedWidthConservingWords(
    sessionForSupervisorKit.examiner,
    font,
    MAX_SESSION_DETAIL_WIDTH
  );
  // @ts-expect-error TS(7006): Parameter 'examiner' implicitly has an 'any' type.
  examinerArray.forEach((examiner, index) => {
    page.drawText(examiner, {
      x: 60,
      y: 549 - index * SESSION_DETAIL_LINE_HEIGHT,
      size: SESSION_DETAIL_FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function _drawSessionId(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const sessionId = String(sessionForSupervisorKit.id);
  const textWidth = font.widthOfTextAtSize(sessionId, 10);
  page.drawText(sessionId, {
    x: 277 - textWidth / 2,
    y: 594,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawSupervisorPassword(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const supervisorPassword = `C-${sessionForSupervisorKit.supervisorPassword}`;
  const textWidth = font.widthOfTextAtSize(supervisorPassword, 10);
  page.drawText(supervisorPassword, {
    x: 383 - textWidth / 2,
    y: 594,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

function _drawAccessCode(sessionForSupervisorKit: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const accessCode = sessionForSupervisorKit.accessCode;
  const textWidth = font.widthOfTextAtSize(accessCode, 10);
  page.drawText(accessCode, {
    x: 486 - textWidth / 2,
    y: 594,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

function _toArrayOfFixedWidthConservingWords(str: $TSFixMe, font: $TSFixMe, maxWidth: $TSFixMe) {
  const result: $TSFixMe = [];
  const words = str.split(' ');
  let index = 0;
  words.forEach((word: $TSFixMe) => {
    if (!result[index]) {
      result[index] = '';
    }
    if (font.widthOfTextAtSize(`${result[index]} ${word}`, 7) <= maxWidth) {
      result[index] += `${word} `;
    } else {
      index++;
      result[index] = `${word} `;
    }
  });
  // @ts-expect-error TS(7006): Parameter 'str' implicitly has an 'any' type.
  return result.map((str) => str.trim());
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getSupervisorKitPdfBuffer,
};
