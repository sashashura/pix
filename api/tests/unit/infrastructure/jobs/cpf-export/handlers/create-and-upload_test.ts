// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon } = require('../../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createAndUpload = require('../../../../../../lib/infrastructure/jobs/cpf-export/handlers/create-and-upload');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PassThroug... Remove this comment to see the full error message
const { PassThrough } = require('stream');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | jobs | cpf-export | create-and-upload', function () {
  let cpfCertificationResultRepository: $TSFixMe;
  let cpfCertificationXmlExportService: $TSFixMe;
  let cpfExternalStorage: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    cpfCertificationResultRepository = {
      findByIdRange: sinon.stub(),
    };
    cpfCertificationXmlExportService = {
      buildXmlExport: sinon.stub(),
    };
    cpfExternalStorage = {
      upload: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should build an xml export file and upload it to an external storage', async function () {
    // given
    const startId = 12;
    const endId = 120;

    const cpfCertificationResults = [
      domainBuilder.buildCpfCertificationResult({ id: 12 }),
      domainBuilder.buildCpfCertificationResult({ id: 20 }),
      domainBuilder.buildCpfCertificationResult({ id: 33 }),
      domainBuilder.buildCpfCertificationResult({ id: 98 }),
      domainBuilder.buildCpfCertificationResult({ id: 114 }),
    ];

    cpfCertificationResultRepository.findByIdRange.resolves(cpfCertificationResults);

    // when
    await createAndUpload({
      data: { startId, endId },
      cpfCertificationResultRepository,
      cpfCertificationXmlExportService,
      cpfExternalStorage,
    });

    // then
    expect(cpfCertificationResultRepository.findByIdRange).to.have.been.calledWith({ startId, endId });
    expect(cpfCertificationXmlExportService.buildXmlExport).to.have.been.calledWith({
      cpfCertificationResults,
      writableStream: sinon.match(PassThrough),
    });
    expect(cpfExternalStorage.upload).to.have.been.calledWith({
      filename: 'pix-cpf-export-from-12-to-120.xml',
      writableStream: sinon.match(PassThrough),
    });
  });
});
