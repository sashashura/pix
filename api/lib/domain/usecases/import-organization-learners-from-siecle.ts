// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
const { FileValidationError, SiecleXmlImportError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { ORGANIZATION_LEARNER_CHUNK_SIZE } = require('../../infrastructure/constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, chunk } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  EMPTY: 'EMPTY',
  INVALID_FILE_EXTENSION: 'INVALID_FILE_EXTENSION',
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function importOrganizationLearnersFromSIECLEFormat({
  organizationId,
  payload,
  format,
  organizationLearnersCsvService,
  organizationLearnersXmlService,
  organizationLearnerRepository,
  organizationRepository,
  i18n
}: $TSFixMe) {
  let organizationLearnerData = [];

  const organization = await organizationRepository.get(organizationId);
  const path = payload.path;

  if (format === 'xml') {
    organizationLearnerData = await organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE(
      path,
      organization
    );
  } else if (format === 'csv') {
    organizationLearnerData = await organizationLearnersCsvService.extractOrganizationLearnersInformation(
      path,
      organization,
      i18n
    );
  } else {
    throw new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE_EXTENSION, { fileExtension: format });
  }

  fs.unlink(payload.path);

  if (isEmpty(organizationLearnerData)) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    throw new SiecleXmlImportError((ERRORS as $TSFixMe).EMPTY);
  }

  const organizationLearnersChunks = chunk(organizationLearnerData, ORGANIZATION_LEARNER_CHUNK_SIZE);

  return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
    await organizationLearnerRepository.disableAllOrganizationLearnersInOrganization({
      domainTransaction,
      organizationId,
    });

    await bluebird.mapSeries(organizationLearnersChunks, (chunk: $TSFixMe) => {
      return organizationLearnerRepository.addOrUpdateOrganizationOfOrganizationLearners(
        chunk,
        organizationId,
        domainTransaction
      );
    });
  });
};
