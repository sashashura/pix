// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readOdsUti... Remove this comment to see the full error message
const readOdsUtils = require('../../infrastructure/utils/ods/read-ods-utils');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTransfo... Remove this comment to see the full error message
  getTransformationStructsForPixCertifCandidatesImport,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../infrastructure/files/candidates-import/candidates-import-transformation-structures');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../models/CertificationCandidate');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
  CLEA,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
  PIX_PLUS_DROIT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_1ER_DEGRE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_2ND_DEGRE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/ComplementaryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidatesImportError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractCertificationCandidatesFromCandidatesImportSheet,
};

async function extractCertificationCandidatesFromCandidatesImportSheet({
  sessionId,
  isSco,
  odsBuffer,
  certificationCpfService,
  certificationCpfCountryRepository,
  certificationCpfCityRepository,
  complementaryCertificationRepository,
  certificationCenterRepository
}: $TSFixMe) {
  const certificationCenter = await certificationCenterRepository.getBySessionId(sessionId);
  const candidateImportStructs = getTransformationStructsForPixCertifCandidatesImport({
    complementaryCertifications: certificationCenter.habilitations,
    isSco,
  });
  try {
    await readOdsUtils.validateOdsHeaders({
      odsBuffer,
      headers: candidateImportStructs.headers,
    });
  } catch (err) {
    _handleVersionError();
  }
  const tableHeaderTargetPropertyMap = candidateImportStructs.transformStruct;
  let certificationCandidatesDataByLine = null;
  try {
    certificationCandidatesDataByLine = await readOdsUtils.extractTableDataFromOdsFile({
      odsBuffer,
      tableHeaderTargetPropertyMap,
    });
  } catch {
    _handleParsingError();
  }

  certificationCandidatesDataByLine = _filterOutEmptyCandidateData(certificationCandidatesDataByLine);

  return await bluebird.mapSeries(
    Object.entries(certificationCandidatesDataByLine),
    // @ts-expect-error TS(7031): Binding element 'line' implicitly has an 'any' typ... Remove this comment to see the full error message
    async ([line, certificationCandidateData]) => {
      let { sex, birthCountry, birthINSEECode, birthPostalCode, birthCity, billingMode } = certificationCandidateData;
      const { hasCleaNumerique, hasPixPlusDroit, hasPixPlusEdu1erDegre, hasPixPlusEdu2ndDegre } =
        certificationCandidateData;

      if (certificationCandidateData.sex?.toUpperCase() === 'M') sex = 'M';
      if (certificationCandidateData.sex?.toUpperCase() === 'F') sex = 'F';

      const cpfBirthInformation = await certificationCpfService.getBirthInformation({
        ...certificationCandidateData,
        certificationCpfCityRepository,
        certificationCpfCountryRepository,
      });

      if (cpfBirthInformation.hasFailed()) {
        _handleBirthInformationValidationError(cpfBirthInformation, line);
      }

      birthCountry = cpfBirthInformation.birthCountry;
      birthINSEECode = cpfBirthInformation.birthINSEECode;
      birthPostalCode = cpfBirthInformation.birthPostalCode;
      birthCity = cpfBirthInformation.birthCity;

      const complementaryCertifications = await _buildComplementaryCertificationsForLine({
        hasCleaNumerique,
        hasPixPlusDroit,
        hasPixPlusEdu1erDegre,
        hasPixPlusEdu2ndDegre,
        complementaryCertificationRepository,
      });

      if (billingMode) {
        billingMode = CertificationCandidate.translateBillingMode(billingMode);
      }

      const certificationCandidate = new CertificationCandidate({
        ...certificationCandidateData,
        birthCountry,
        birthINSEECode,
        birthPostalCode,
        birthCity,
        sex,
        sessionId,
        complementaryCertifications,
        billingMode,
      });

      try {
        certificationCandidate.validate(isSco);
      } catch (err) {
        _handleFieldValidationError(err, tableHeaderTargetPropertyMap, line);
      }

      return certificationCandidate;
    }
  );
}

function _filterOutEmptyCandidateData(certificationCandidatesData: $TSFixMe) {
  return _(certificationCandidatesData)
    .mapValues(_nullifyObjectWithOnlyNilValues)
    .pickBy((value: $TSFixMe) => !_.isNull(value))
    .value();
}

function _nullifyObjectWithOnlyNilValues(data: $TSFixMe) {
  for (const propName in data) {
    if (!_.isNil(data[propName])) {
      return data;
    }
  }
  return null;
}

function _handleFieldValidationError(err: $TSFixMe, tableHeaderTargetPropertyMap: $TSFixMe, line: $TSFixMe) {
  const keyLabelMap = tableHeaderTargetPropertyMap.reduce((acc: $TSFixMe, obj: $TSFixMe) => {
    acc[obj.property] = obj.header;
    return acc;
  }, {});
  line = parseInt(line) + 1;
  throw CertificationCandidatesImportError.fromInvalidCertificationCandidateError(err, keyLabelMap, line);
}

function _handleBirthInformationValidationError(cpfBirthInformation: $TSFixMe, line: $TSFixMe) {
  line = parseInt(line) + 1;
  throw new CertificationCandidatesImportError({ message: `Ligne ${line} : ${cpfBirthInformation.message}` });
}

function _handleVersionError() {
  throw new CertificationCandidatesImportError({
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'null | un... Remove this comment to see the full error message
    code: 'INVALID_DOCUMENT',
    message: 'La version du document est inconnue.',
  });
}

function _handleParsingError() {
  // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'null | un... Remove this comment to see the full error message
  throw new CertificationCandidatesImportError({ code: 'INVALID_DOCUMENT', message: 'Le document est invalide.' });
}

async function _buildComplementaryCertificationsForLine({
  hasCleaNumerique,
  hasPixPlusDroit,
  hasPixPlusEdu1erDegre,
  hasPixPlusEdu2ndDegre,
  complementaryCertificationRepository
}: $TSFixMe) {
  const complementaryCertifications = [];
  const complementaryCertificationsInDB = await complementaryCertificationRepository.findAll();
  if (hasCleaNumerique) {
    complementaryCertifications.push(
      complementaryCertificationsInDB.find((complementaryCertification: $TSFixMe) => complementaryCertification.key === CLEA)
    );
  }
  if (hasPixPlusDroit) {
    complementaryCertifications.push(
      complementaryCertificationsInDB.find(
        (complementaryCertification: $TSFixMe) => complementaryCertification.key === PIX_PLUS_DROIT
      )
    );
  }
  if (hasPixPlusEdu1erDegre) {
    complementaryCertifications.push(
      complementaryCertificationsInDB.find(
        (complementaryCertification: $TSFixMe) => complementaryCertification.key === PIX_PLUS_EDU_1ER_DEGRE
      )
    );
  }
  if (hasPixPlusEdu2ndDegre) {
    complementaryCertifications.push(
      complementaryCertificationsInDB.find(
        (complementaryCertification: $TSFixMe) => complementaryCertification.key === PIX_PLUS_EDU_2ND_DEGRE
      )
    );
  }
  return complementaryCertifications;
}
