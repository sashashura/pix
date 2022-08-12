// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'samlify'.
const samlify = require('samlify');
samlify.setSchemaValidator({
  validate: () => {
    return true;
  },
});
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('./logger');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const samlSettings = require('../config').saml;

let _serviceProvider: $TSFixMe, _identityProvider: $TSFixMe;

function _getServiceProvider() {
  if (!_serviceProvider) {
    try {
      _serviceProvider = samlify.ServiceProvider(samlSettings.spConfig);
      logger.info('Initialized SAML service provider');
    } catch (err) {
      (err as $TSFixMe).message = 'Error initializing SAML service provider: ' + (err as $TSFixMe).message;
      throw err;
    }
  }
  return _serviceProvider;
}

function _getIdentityProvider() {
  if (!_identityProvider) {
    try {
      _identityProvider = samlify.IdentityProvider(samlSettings.idpConfig);
      logger.info('Initialized SAML identity provider');
    } catch (err) {
      (err as $TSFixMe).message = 'Error initializing SAML identity provider: ' + (err as $TSFixMe).message;
      throw err;
    }
  }
  return _identityProvider;
}

async function parsePostResponse(payload: $TSFixMe) {
  logger.trace({ SAMLPayload: payload }, 'Parsing SAML response');
  const { extract } = await _getServiceProvider().parseLoginResponse(_getIdentityProvider(), 'post', { body: payload });
  logger.trace({ parsedSAML: extract }, 'Parsed SAML response');
  return extract.attributes;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getServiceProviderMetadata() {
    return _getServiceProvider().getMetadata();
  },

  createLoginRequest() {
    const { context } = _getServiceProvider().createLoginRequest(_getIdentityProvider(), 'redirect');
    logger.trace({ SAMLRequest: context }, 'Created SAML request');
    return context;
  },

  parsePostResponse,
};
