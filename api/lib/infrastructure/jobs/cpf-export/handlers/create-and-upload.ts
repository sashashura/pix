// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PassThroug... Remove this comment to see the full error message
const { PassThrough } = require('stream');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createAndUpload({
  data,
  cpfCertificationResultRepository,
  cpfCertificationXmlExportService,
  cpfExternalStorage
}: $TSFixMe) {
  const { startId, endId } = data;
  const cpfCertificationResults = await cpfCertificationResultRepository.findByIdRange({
    startId,
    endId,
  });

  const writableStream = new PassThrough();
  cpfCertificationXmlExportService.buildXmlExport({ cpfCertificationResults, writableStream });

  const filename = `pix-cpf-export-from-${startId}-to-${endId}.xml`;
  await cpfExternalStorage.upload({ filename, writableStream });
};
