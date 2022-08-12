// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'injectDepe... Remove this comment to see the full error message
const { injectDependencies } = require('../../utils/dependency-injection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dependenci... Remove this comment to see the full error message
const dependencies = {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  cpfCertificationResultRepository: require('../../repositories/cpf-certification-result-repository'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  cpfCertificationXmlExportService: require('../../../domain/services/cpf-certification-xml-export-service'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  cpfExternalStorage: require('../../external-storage/cpf-external-storage'),
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = injectDependencies(
  {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    planner: require('./handlers/planner'),
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    createAndUpload: require('./handlers/create-and-upload'),
  },
  dependencies
);
