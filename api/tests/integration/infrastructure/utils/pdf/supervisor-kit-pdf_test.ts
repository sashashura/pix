// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isSameBina... Remove this comment to see the full error message
const { isSameBinary } = require('../../../../tooling/binary-comparator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSupervi... Remove this comment to see the full error message
const { getSupervisorKitPdfBuffer } = require('../../../../../lib/infrastructure/utils/pdf/supervisor-kit-pdf');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addRandomS... Remove this comment to see the full error message
const { addRandomSuffix } = require('pdf-lib/cjs/utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Utils | Pdf | Certification supervisor kit Pdf', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    _makePdfLibPredictable();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    _restorePdfLib();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return full supervisor kit as a buffer', async function () {
    // given
    const sessionForSupervisorKit = domainBuilder.buildSessionForSupervisorKit({
      id: 12345678,
      supervisorPassword: 12344,
      accessCode: 'WB64K2',
      date: '2022-09-21',
      examiner: 'Ariete Bordeauxchesnel',
    });
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    const expectedPdfPath = __dirname + '/kit-surveillant_expected.pdf';

    // when
    const { buffer: actualSupervisorKitBuffer, fileName } = await getSupervisorKitPdfBuffer({
      sessionForSupervisorKit,
      creationDate: new Date('2021-01-01'),
    });

    // Note: to update the reference pdf, you can run the test with the following lines.
    //
    // const { writeFile } = require('fs/promises');
    // await writeFile(expectedPdfPath, actualSupervisorKitBuffer);

    // then
    expect(await isSameBinary(expectedPdfPath, actualSupervisorKitBuffer)).to.be.true;
    expect(fileName).to.equal(`kit-surveillant-${sessionForSupervisorKit.id}.pdf`);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when session details contains long labels', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return full supervisor kit as a buffer with long labels in multiple lines', async function () {
      // given
      const sessionForSupervisorKit = domainBuilder.buildSessionForSupervisorKit({
        id: 12345678,
        supervisorPassword: 12344,
        accessCode: 'WB64K2',
        date: '2022-09-21',
        examiner: 'Un nom très très très très très très très très très très long',
        address: 'Une adresse qui ne tient pas sur une seule ligne',
        room: 'Une salle particulièrement longue mais on ne sait jamais',
      });
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      const expectedPdfPath = __dirname + '/kit-surveillant-with-long-labels_expected.pdf';

      // when
      const { buffer: actualSupervisorKitBuffer, fileName } = await getSupervisorKitPdfBuffer({
        sessionForSupervisorKit,
        creationDate: new Date('2021-01-01'),
      });

      // Note: to update the reference pdf, you can run the test with the following lines.
      //
      // const { writeFile } = require('fs/promises');
      // await writeFile(expectedPdfPath, actualSupervisorKitBuffer);

      // then
      expect(await isSameBinary(expectedPdfPath, actualSupervisorKitBuffer)).to.be.true;
      expect(fileName).to.equal(`kit-surveillant-${sessionForSupervisorKit.id}.pdf`);
    });
  });
});

// Warning: call _restorePdfLib() when finished /!\
function _makePdfLibPredictable() {
  const suffixes = new Map();

  function autoIncrementSuffixByPrefix(prefix: $TSFixMe, suffixLength: $TSFixMe) {
    if (suffixLength === void 0) {
      suffixLength = 4;
    }

    const suffix = (suffixes.get(prefix) ?? Math.pow(10, suffixLength)) + 1;
    suffixes.set(prefix, suffix);

    return prefix + '-' + Math.floor(suffix);
  }

  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('pdf-lib/cjs/utils').addRandomSuffix = autoIncrementSuffixByPrefix;
}

function _restorePdfLib() {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('pdf-lib/cjs/utils').addRandomSuffix = addRandomSuffix;
}
