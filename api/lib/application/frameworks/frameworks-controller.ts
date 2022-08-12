// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'frameworkA... Remove this comment to see the full error message
const frameworkAreasSerializer = require('../../infrastructure/serializers/jsonapi/framework-areas-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'frameworkS... Remove this comment to see the full error message
const frameworkSerializer = require('../../infrastructure/serializers/jsonapi/framework-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getPixFramework(request: $TSFixMe) {
    const locale = extractLocaleFromRequest(request);
    const framework = await usecases.getFrameworkAreas({ frameworkName: 'Pix', locale });
    return frameworkAreasSerializer.serialize(framework);
  },
  async getFrameworks() {
    const frameworks = await usecases.getFrameworks();
    return frameworkSerializer.serialize(frameworks);
  },
  async getFrameworkAreas(request: $TSFixMe) {
    const frameworkId = request.params.id;
    const framework = await usecases.getFrameworkAreas({ frameworkId });
    return frameworkAreasSerializer.serialize(framework);
  },
};
