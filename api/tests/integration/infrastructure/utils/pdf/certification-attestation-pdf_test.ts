// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isSameBina... Remove this comment to see the full error message
const { isSameBinary } = require('../../../../tooling/binary-comparator');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCertifi... Remove this comment to see the full error message
  getCertificationAttestationsPdfBuffer,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/infrastructure/utils/pdf/certification-attestation-pdf');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'addRandomS... Remove this comment to see the full error message
const { addRandomSuffix } = require('pdf-lib/cjs/utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Utils | Pdf | Certification Attestation Pdf', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    _makePdfLibPredictable();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    _restorePdfLib();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should generate full attestation (non-regression test)', async function () {
    // given
    const resultCompetenceTree = domainBuilder.buildResultCompetenceTree();
    const certificate = domainBuilder.buildCertificationAttestation({
      id: 1,
      firstName: 'Jean',
      lastName: 'Bon',
      resultCompetenceTree,
      certifiedBadges: [{ partnerKey: PIX_EMPLOI_CLEA_V3 }, { partnerKey: PIX_DROIT_MAITRE_CERTIF }],
    });
    const referencePdfPath = 'certification-attestation-pdf_test_full.pdf';

    // when
    const { buffer } = await getCertificationAttestationsPdfBuffer({
      certificates: [certificate],
      creationDate: new Date('2021-01-01'),
    });

    await _writeFile(buffer, referencePdfPath);

    // then
    expect(
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      await isSameBinary(`${__dirname}/${referencePdfPath}`, buffer),
      referencePdfPath + ' is not generated as expected'
    ).to.be.true;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should generate full attestation with Pix+ Édu temporary badge', async function () {
    // given
    const resultCompetenceTree = domainBuilder.buildResultCompetenceTree();
    const certificate = domainBuilder.buildCertificationAttestation({
      id: 1,
      firstName: 'Jean',
      lastName: 'Bon',
      resultCompetenceTree,
      certifiedBadges: [{ partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE, isTemporaryBadge: true }],
    });
    const referencePdfPath = 'certification-attestation-pdf_test_full_edu_temporary.pdf';

    // when
    const { buffer } = await getCertificationAttestationsPdfBuffer({
      certificates: [certificate],
      creationDate: new Date('2021-01-01'),
    });

    await _writeFile(buffer, referencePdfPath);

    // then
    expect(
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      await isSameBinary(`${__dirname}/${referencePdfPath}`, buffer),
      referencePdfPath + ' is not generated as expected'
    ).to.be.true;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should generate full attestation with Pix+ Édu definitive badge', async function () {
    // given
    const resultCompetenceTree = domainBuilder.buildResultCompetenceTree();
    const certificate = domainBuilder.buildCertificationAttestation({
      id: 1,
      firstName: 'Jean',
      lastName: 'Bon',
      resultCompetenceTree,
      certifiedBadges: [{ partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE, isTemporaryBadge: false }],
    });
    const referencePdfPath = 'certification-attestation-pdf_test_full_edu.pdf';

    // when
    const { buffer } = await getCertificationAttestationsPdfBuffer({
      certificates: [certificate],
      creationDate: new Date('2021-01-01'),
    });

    await _writeFile(buffer, referencePdfPath);

    // then
    expect(
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      await isSameBinary(`${__dirname}/${referencePdfPath}`, buffer),
      referencePdfPath + ' is not generated as expected'
    ).to.be.true;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should generate a page per certificate', async function () {
    // given
    const professionalizingValidityStartDate = new Date('2022-01-01');
    const deliveredBeforeStartDate = moment(professionalizingValidityStartDate).subtract(1, 'days').toDate();
    const deliveredAfterStartDate = moment(professionalizingValidityStartDate).add(1, 'days').toDate();

    const resultCompetenceTree = domainBuilder.buildResultCompetenceTree();
    const certificateWithComplementaryCertificationsAndWithoutProfessionalizingMessage =
      domainBuilder.buildCertificationAttestation({
        id: 1,
        firstName: 'Jean',
        lastName: 'Bon',
        resultCompetenceTree,
        certifiedBadges: [{ partnerKey: PIX_EMPLOI_CLEA_V3 }, { partnerKey: PIX_DROIT_MAITRE_CERTIF }],
        deliveredAt: deliveredBeforeStartDate,
      });
    const certificateWithComplementaryCertificationsAndWithProfessionalizingMessage =
      domainBuilder.buildCertificationAttestation({
        id: 2,
        firstName: 'Harry',
        lastName: 'Covert',
        resultCompetenceTree,
        certifiedBadges: [{ partnerKey: PIX_EMPLOI_CLEA_V3 }, { partnerKey: PIX_DROIT_EXPERT_CERTIF }],
        deliveredAt: deliveredAfterStartDate,
      });
    const certificateWithoutComplementaryCertificationsAndWithoutProfessionalizingMessage =
      domainBuilder.buildCertificationAttestation({
        ...certificateWithComplementaryCertificationsAndWithoutProfessionalizingMessage,
        id: 2,
        firstName: 'Marc',
        lastName: 'Decaffé',
        cleaCertificationImagePath: null,
        pixPlusDroitCertificationImagePath: null,
        certifiedBadges: [],
        deliveredAt: deliveredBeforeStartDate,
      });
    const certificateComplementaryCertificationsAndWithProfessionalizingMessage =
      domainBuilder.buildCertificationAttestation({
        ...certificateWithComplementaryCertificationsAndWithoutProfessionalizingMessage,
        id: 2,
        firstName: 'Quentin',
        lastName: 'Bug Arrive En Prod',
        cleaCertificationImagePath: null,
        pixPlusDroitCertificationImagePath: null,
        certifiedBadges: [],
        deliveredAt: deliveredAfterStartDate,
      });
    const referencePdfPath = 'certification-attestation-pdf_several_pages.pdf';

    // when
    const { buffer } = await getCertificationAttestationsPdfBuffer({
      certificates: [
        certificateWithComplementaryCertificationsAndWithoutProfessionalizingMessage,
        certificateWithComplementaryCertificationsAndWithProfessionalizingMessage,
        certificateWithoutComplementaryCertificationsAndWithoutProfessionalizingMessage,
        certificateComplementaryCertificationsAndWithProfessionalizingMessage,
      ],
      isFrenchDomainExtension: true,
      creationDate: new Date('2021-01-01'),
    });

    await _writeFile(buffer, referencePdfPath);

    // then
    expect(
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      await isSameBinary(`${__dirname}/${referencePdfPath}`, buffer),
      referencePdfPath + ' is not generated as expected'
    ).to.be.true;
  });
});

async function _writeFile(buffer: $TSFixMe, outputFilename: $TSFixMe, dryRun = true) {
  // Note: to update the reference pdf, set dryRun to false.
  if (!dryRun) {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const { writeFile } = require('fs/promises');
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    await writeFile(`${__dirname}/${outputFilename}`, buffer);
  }
}

// Warning: call _restorePdfLib() when finished /!\
// @ts-expect-error TS(2393): Duplicate function implementation.
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

// @ts-expect-error TS(2393): Duplicate function implementation.
function _restorePdfLib() {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('pdf-lib/cjs/utils').addRandomSuffix = addRandomSuffix;
}
