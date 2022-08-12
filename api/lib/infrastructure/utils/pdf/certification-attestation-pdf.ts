// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PDFDocumen... Remove this comment to see the full error message
const { PDFDocument, rgb } = require('pdf-lib');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readFile'.
const { readFile } = require('fs/promises');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pdfLibFont... Remove this comment to see the full error message
const pdfLibFontkit = require('@pdf-lib/fontkit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Attestatio... Remove this comment to see the full error message
const AttestationViewModel = require('./AttestationViewModel');

const fonts = {
  openSansBold: 'OpenSans-Bold.ttf',
  openSansSemiBold: 'OpenSans-SemiBold.ttf',
  robotoMedium: 'Roboto-Medium.ttf',
  robotoMonoRegular: 'RobotoMono-Regular.ttf',
};

const templates = {
  withProfessionalizingCertificationMessageAndWithComplementaryCertifications:
    'withProfessionalizingCertificationMessageAndWithComplementaryCertifications',
  withProfessionalizingCertificationMessageAndWithoutComplementaryCertifications:
    'withProfessionalizingCertificationMessageAndWithoutComplementaryCertifications',
  withoutProfessionalizingCertificationMessageAndWithComplementaryCertifications:
    'withoutProfessionalizingCertificationMessageAndWithComplementaryCertifications',
  withoutProfessionalizingCertificationMessageAndWithoutComplementaryCertifications:
    'withoutProfessionalizingCertificationMessageAndWithoutComplementaryCertifications',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCertifi... Remove this comment to see the full error message
async function getCertificationAttestationsPdfBuffer({
  certificates,
  isFrenchDomainExtension,
  // @ts-expect-error TS(2552): Cannot find name '__dirname'. Did you mean 'dirnam... Remove this comment to see the full error message
  dirname = __dirname,
  fontkit = pdfLibFontkit,
  creationDate = new Date()
}: $TSFixMe = {}) {
  const viewModels = certificates.map((certificate: $TSFixMe) => AttestationViewModel.from(certificate, isFrenchDomainExtension));
  const generatedPdfDoc = await _initializeNewPDFDocument(fontkit);
  generatedPdfDoc.setCreationDate(creationDate);
  generatedPdfDoc.setModificationDate(creationDate);
  const embeddedFonts = await _embedFonts(generatedPdfDoc, dirname);
  const embeddedImages = await _embedImages(generatedPdfDoc, viewModels);

  const templatePdfPages = await _embedTemplatePagesIntoDocument(viewModels, dirname, generatedPdfDoc);

  await _render({ templatePdfPages, pdfDocument: generatedPdfDoc, viewModels, rgb, embeddedFonts, embeddedImages });

  const buffer = await _finalizeDocument(generatedPdfDoc);

  const fileName = `attestation-pix-${moment(certificates[0].deliveredAt).format('YYYYMMDD')}.pdf`;

  return {
    buffer,
    fileName,
  };
}

async function _initializeNewPDFDocument(fontkit: $TSFixMe) {
  const pdfDocument = await PDFDocument.create();
  pdfDocument.registerFontkit(fontkit);
  return pdfDocument;
}

async function _embedFonts(pdfDocument: $TSFixMe, dirname: $TSFixMe) {
  const embeddedFonts = {};
  for (const fontKey in fonts) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const embeddedFont = await _embedFontInPDFDocument(pdfDocument, fonts[fontKey], dirname);
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    embeddedFonts[fontKey] = embeddedFont;
  }
  return embeddedFonts;
}

async function _embedFontInPDFDocument(pdfDoc: $TSFixMe, fontFileName: $TSFixMe, dirname: $TSFixMe) {
  const fontFile = await readFile(`${dirname}/files/${fontFileName}`);
  return pdfDoc.embedFont(fontFile, { subset: true, customName: fontFileName });
}

async function _embedImages(pdfDocument: $TSFixMe, viewModels: $TSFixMe) {
  const embeddedImages = {};
  const viewModelsWithCleaCertification = _.filter(viewModels, (viewModel: $TSFixMe) => viewModel.shouldDisplayCleaCertification()
  );

  if (viewModelsWithCleaCertification.length > 0) {
    const cleaCertificationImagePath = viewModelsWithCleaCertification[0].cleaCertificationImagePath;
    const image = await _embedCertificationImage(pdfDocument, cleaCertificationImagePath);
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    embeddedImages[cleaCertificationImagePath] = image;
  }

  const viewModelsWithPixPlusDroitCertification = _.filter(viewModels, (viewModel: $TSFixMe) => viewModel.shouldDisplayPixPlusDroitCertification()
  );

  if (viewModelsWithPixPlusDroitCertification.length > 0) {
    const singleImagePaths = _(viewModelsWithPixPlusDroitCertification)
      .map('pixPlusDroitCertificationImagePath')
      .uniq()
      .value();
    for (const path of singleImagePaths) {
      const image = await _embedCertificationImage(pdfDocument, path);
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      embeddedImages[path] = image;
    }
  }

  const viewModelsWithPixPlusEduCertification = _.filter(viewModels, (viewModel: $TSFixMe) => viewModel.shouldDisplayPixPlusEduCertification()
  );

  if (viewModelsWithPixPlusEduCertification.length > 0) {
    const singleImagePaths = _(viewModelsWithPixPlusEduCertification)
      .map('pixPlusEduCertificationImagePath')
      .uniq()
      .value();
    for (const path of singleImagePaths) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      embeddedImages[path] = await _embedCertificationImage(pdfDocument, path);
    }
  }
  return embeddedImages;
}

async function _embedCertificationImage(pdfDocument: $TSFixMe, certificationImagePath: $TSFixMe) {
  const pngBuffer = await readFile(certificationImagePath);
  const [page] = await pdfDocument.embedPdf(pngBuffer);
  return page;
}

async function _embedTemplatePagesIntoDocument(viewModels: $TSFixMe, dirname: $TSFixMe, pdfDocument: $TSFixMe) {
  const templatePages = {};

  if (_atLeastOneWithComplementaryCertifications(viewModels)) {
    if (_atLeastOneWithProfessionalizingCertification(viewModels)) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      templatePages[templates.withProfessionalizingCertificationMessageAndWithComplementaryCertifications] =
        await _embedFirstPageFromTemplateByFilename(
          'attestation-template-with-professionalizing-message-and-with-complementary-certifications.pdf',
          pdfDocument,
          dirname
        );
    }

    if (_atLeastOneWithoutProfessionalizingCertification(viewModels)) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      templatePages[templates.withoutProfessionalizingCertificationMessageAndWithComplementaryCertifications] =
        await _embedFirstPageFromTemplateByFilename(
          'attestation-template-without-professionalizing-message-and-with-complementary-certifications.pdf',
          pdfDocument,
          dirname
        );
    }
  }

  if (_atLeastOneWithoutComplementaryCertifications(viewModels)) {
    if (_atLeastOneWithProfessionalizingCertification(viewModels)) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      templatePages[templates.withProfessionalizingCertificationMessageAndWithoutComplementaryCertifications] =
        await _embedFirstPageFromTemplateByFilename(
          'attestation-template-with-professionalizing-message-and-without-complementary-certifications.pdf',
          pdfDocument,
          dirname
        );
    }

    if (_atLeastOneWithoutProfessionalizingCertification(viewModels)) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      templatePages[templates.withoutProfessionalizingCertificationMessageAndWithoutComplementaryCertifications] =
        await _embedFirstPageFromTemplateByFilename(
          'attestation-template-without-professionalizing-message-and-without-complementary-certifications.pdf',
          pdfDocument,
          dirname
        );
    }
  }

  return templatePages;
}

async function _embedFirstPageFromTemplateByFilename(templatePdfDocumentFileName: $TSFixMe, destinationDocument: $TSFixMe, dirname: $TSFixMe) {
  const templateBuffer = await _loadTemplateByFilename(templatePdfDocumentFileName, dirname);
  const [templatePage] = await destinationDocument.embedPdf(templateBuffer);
  return templatePage;
}

function _atLeastOneWithComplementaryCertifications(viewModels: $TSFixMe) {
  return _.some(viewModels, (viewModel: $TSFixMe) => viewModel.shouldDisplayComplementaryCertifications());
}

function _atLeastOneWithoutComplementaryCertifications(viewModels: $TSFixMe) {
  return _.some(viewModels, (viewModel: $TSFixMe) => !viewModel.shouldDisplayComplementaryCertifications());
}

function _atLeastOneWithProfessionalizingCertification(viewModels: $TSFixMe) {
  return _.some(viewModels, (viewModel: $TSFixMe) => viewModel.shouldDisplayProfessionalizingCertificationMessage());
}

function _atLeastOneWithoutProfessionalizingCertification(viewModels: $TSFixMe) {
  return _.some(viewModels, (viewModel: $TSFixMe) => !viewModel.shouldDisplayProfessionalizingCertificationMessage());
}

async function _loadTemplateByFilename(templateFileName: $TSFixMe, dirname: $TSFixMe) {
  const path = `${dirname}/files/${templateFileName}`;
  return readFile(path);
}

async function _render({
  templatePdfPages,
  pdfDocument,
  viewModels,
  rgb,
  embeddedFonts,
  embeddedImages
}: $TSFixMe) {
  for (const viewModel of viewModels) {
    const newPage = pdfDocument.addPage();

    const templatePage = await _getTemplatePage(viewModel, templatePdfPages);
    newPage.drawPage(templatePage);

    // Note: calls to setFont() are mutualized outside of the _render* methods
    // to save space. Calling setFont() n times with the same fonts creates
    // unnecessary links and big documents.
    //
    // For the same reason, don't use the `font` option of `drawText()`.
    // Size gains for 140 certifs: 5 MB -> 700 kB
    newPage.setFont(embeddedFonts.openSansBold);
    _renderScore(viewModel, newPage, embeddedFonts.openSansBold);
    _renderHeaderCandidateInformations(viewModel, newPage, rgb);
    _renderFooter(viewModel, newPage, rgb);

    newPage.setFont(embeddedFonts.robotoMedium);
    _renderCompetencesDetails(viewModel, newPage, rgb);

    newPage.setFont(embeddedFonts.openSansSemiBold);
    _renderMaxScore(viewModel, newPage, rgb, embeddedFonts.openSansSemiBold);
    _renderMaxLevel(viewModel, newPage, rgb);

    newPage.setFont(embeddedFonts.robotoMonoRegular);
    _renderVerificationCode(viewModel, newPage, rgb);

    _renderCleaCertification(viewModel, newPage, embeddedImages);
    _renderPixPlusCertificationCertification(viewModel, newPage, embeddedImages);
  }
}

async function _getTemplatePage(viewModel: $TSFixMe, templatePdfPages: $TSFixMe) {
  if (viewModel.shouldDisplayComplementaryCertifications()) {
    if (viewModel.shouldDisplayProfessionalizingCertificationMessage()) {
      return templatePdfPages.withProfessionalizingCertificationMessageAndWithComplementaryCertifications;
    } else {
      return templatePdfPages.withoutProfessionalizingCertificationMessageAndWithComplementaryCertifications;
    }
  } else {
    if (viewModel.shouldDisplayProfessionalizingCertificationMessage()) {
      return templatePdfPages.withProfessionalizingCertificationMessageAndWithoutComplementaryCertifications;
    }
    return templatePdfPages.withoutProfessionalizingCertificationMessageAndWithoutComplementaryCertifications;
  }
}

function _renderScore(viewModel: $TSFixMe, page: $TSFixMe, font: $TSFixMe) {
  const pixScore = viewModel.pixScore;
  const scoreFontSize = 24;
  const scoreWidth = font.widthOfTextAtSize(pixScore, scoreFontSize);

  page.drawText(pixScore, {
    x: 105 - scoreWidth / 2,
    y: 675,
    size: scoreFontSize,
  });
}

function _renderMaxScore(viewModel: $TSFixMe, page: $TSFixMe, rgb: $TSFixMe, font: $TSFixMe) {
  const maxScoreFontSize = 9;

  const maxReachableScore = viewModel.maxReachableScore;
  const maxScoreWidth = font.widthOfTextAtSize(maxReachableScore, maxScoreFontSize);

  page.drawText(maxReachableScore, {
    x: 105 - maxScoreWidth / 2,
    y: 659,
    size: maxScoreFontSize,
    color: rgb(0 / 255, 45 / 255, 80 / 255),
  });
}

function _renderMaxLevel(viewModel: $TSFixMe, page: $TSFixMe, rgb: $TSFixMe) {
  page.drawText(viewModel.maxLevel, {
    x: 159,
    y: 608,
    size: 7,
    color: rgb(80 / 255, 95 / 255, 121 / 255),
  });
}

function _renderFooter(viewModel: $TSFixMe, page: $TSFixMe, rgb: $TSFixMe) {
  page.drawText(viewModel.maxReachableLevelIndication, {
    x: 55,
    y: 46,
    size: 7,
    color: rgb(42 / 255, 64 / 255, 99 / 255),
  });

  if (viewModel.shouldDisplayAbsoluteMaxLevelIndication()) {
    page.drawText(viewModel.absoluteMaxLevelIndication, {
      x: 55,
      y: 35,
      size: 7,
      color: rgb(42 / 255, 64 / 255, 99 / 255),
    });
  }
}

function _renderHeaderCandidateInformations(viewModel: $TSFixMe, page: $TSFixMe, rgb: $TSFixMe) {
  [
    [230, 712, viewModel.fullName],
    [269, 695.5, viewModel.birth],
    [257, 680, viewModel.certificationCenter],
    [208, 663.5, viewModel.certificationDate],
  ].forEach(([x, y, text]) => {
    page.drawText(text, {
      x,
      y,
      size: 9,
      color: rgb(26 / 255, 64 / 255, 109 / 255),
    });
  });
}

function _renderVerificationCode(viewModel: $TSFixMe, page: $TSFixMe, rgb: $TSFixMe) {
  page.drawText(viewModel.verificationCode, {
    x: 410,
    y: 560,
    size: 11,
    color: rgb(1, 1, 1),
  });
}

function _renderPixPlusCertificationCertification(viewModel: $TSFixMe, page: $TSFixMe, embeddedImages: $TSFixMe) {
  let yCoordinate = 480;

  if (viewModel.shouldDisplayCleaCertification()) {
    yCoordinate -= 84;
  }

  if (viewModel.shouldDisplayPixPlusDroitCertification()) {
    const pdfImage = embeddedImages[viewModel.pixPlusDroitCertificationImagePath];
    page.drawPage(pdfImage, {
      x: 397,
      y: yCoordinate - 111,
      width: 85,
      height: 111,
    });
    yCoordinate -= 111;
  }

  if (viewModel.shouldDisplayPixPlusEduCertification()) {
    const pdfImage = embeddedImages[viewModel.pixPlusEduCertificationImagePath];
    page.drawPage(pdfImage, {
      x: 400,
      y: yCoordinate - 89,
      width: 80,
      height: 89,
    });
    yCoordinate -= 89 + 15;

    if (viewModel.pixPlusEduBadgeMessage) {
      viewModel.pixPlusEduBadgeMessage.forEach((text: $TSFixMe, index: $TSFixMe) => {
        page.drawText(text, {
          x: 350,
          y: yCoordinate - index * 10,
          size: 7,
          color: rgb(37 / 255, 56 / 255, 88 / 255),
        });
      });
    }
  }
}

function _renderCleaCertification(viewModel: $TSFixMe, page: $TSFixMe, embeddedImages: $TSFixMe) {
  if (viewModel.shouldDisplayCleaCertification()) {
    const pdfImage = embeddedImages[viewModel.cleaCertificationImagePath];
    page.drawPage(pdfImage, {
      x: 400,
      y: 400,
      width: 80,
      height: 84,
    });
  }
}

function _renderCompetencesDetails(viewModel: $TSFixMe, page: $TSFixMe, rgb: $TSFixMe) {
  const competencesLevelCoordinates = [556, 532, 508, 452, 428, 404, 380, 324, 300, 276, 252, 196, 172, 148, 92, 68];

  viewModel.competenceDetailViewModels.forEach((competenceDetailViewModel: $TSFixMe) => {
    const y = competencesLevelCoordinates.shift();
    if (competenceDetailViewModel.shouldBeDisplayed()) {
      page.drawText(competenceDetailViewModel.level, {
        x: 291,
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        y: y + 5,
        size: 9,
        color: rgb(37 / 255, 56 / 255, 88 / 255),
      });
    } else {
      page.drawRectangle({
        x: 65,
        y,
        width: 210,
        height: 18,
        color: rgb(1, 1, 1),
        opacity: 0.5,
      });
    }
  });
}

async function _finalizeDocument(pdfDocument: $TSFixMe) {
  const pdfBytes = await pdfDocument.save();
  const buffer = Buffer.from(pdfBytes);
  return buffer;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getCertificationAttestationsPdfBuffer,
};
