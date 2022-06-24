/* eslint-disable node/no-process-env*/
const path = require('path');
const moment = require('moment');
const ms = require('ms');

const { getArrayOfStrings } = require('../lib/infrastructure/utils/string-utils');

function parseJSONEnv(varName) {
  if (process.env[varName]) {
    return JSON.parse(process.env[varName]);
  }
  return undefined;
}

function isFeatureEnabled(environmentVariable) {
  return environmentVariable === 'true';
}

function isBooleanFeatureEnabledElseDefault(environmentVariable, defaultValue) {
  return environmentVariable === 'true' ? true : defaultValue;
}

function _getNumber(numberAsString, defaultIntNumber) {
  const number = parseInt(numberAsString, 10);
  return isNaN(number) ? defaultIntNumber : number;
}

function _getDate(dateAsString) {
  if (!dateAsString) {
    return null;
  }
  const dateAsMoment = moment(dateAsString);
  if (!dateAsMoment.isValid()) {
    return null;
  }

  return dateAsMoment.toDate();
}

function _removeTrailingSlashFromUrl(url) {
  return url.replace(/\/$/, '');
}

function _getLogForHumans() {
  const processOutputingToTerminal = process.stdout.isTTY;
  const forceJSONLogs = process.env.LOG_FOR_HUMANS === 'false';
  return processOutputingToTerminal && !forceJSONLogs;
}

module.exports = (function () {
  const config = {
    rootPath: path.normalize(__dirname + '/..'),

    port: parseInt(process.env.PORT, 10) || 3000,

    environment: process.env.NODE_ENV || 'development',

    logOpsMetrics: isFeatureEnabled(process.env.LOG_OPS_METRICS),

    version: process.env.CONTAINER_VERSION || 'development',

    hapi: {
      options: {},
      enableRequestMonitoring: isFeatureEnabled(process.env.ENABLE_REQUEST_MONITORING),
    },

    domain: {
      tldFr: process.env.TLD_FR || '.fr',
      tldOrg: process.env.TLD_ORG || '.org',
      pix: process.env.DOMAIN_PIX || 'https://pix',
      pixApp: process.env.DOMAIN_PIX_APP || 'https://app.pix',
      pixOrga: process.env.DOMAIN_PIX_ORGA || 'https://orga.pix',
    },

    lcms: {
      url: _removeTrailingSlashFromUrl(process.env.CYPRESS_LCMS_API_URL || process.env.LCMS_API_URL || ''),
      apiKey: process.env.CYPRESS_LCMS_API_KEY || process.env.LCMS_API_KEY,
    },

    logging: {
      enabled: isFeatureEnabled(process.env.LOG_ENABLED),
      logLevel: process.env.LOG_LEVEL || 'info',
      logForHumans: _getLogForHumans(),
      enableLogKnexQueries: isFeatureEnabled(process.env.LOG_KNEX_QUERIES),
      enableLogStartingEventDispatch: isFeatureEnabled(process.env.LOG_STARTING_EVENT_DISPATCH),
      enableLogEndingEventDispatch: isFeatureEnabled(process.env.LOG_ENDING_EVENT_DISPATCH),
      emitOpsEventEachSeconds: isFeatureEnabled(process.env.OPS_EVENT_EACH_SECONDS) || 15,
    },

    mailing: {
      enabled: isFeatureEnabled(process.env.MAILING_ENABLED),
      provider: process.env.MAILING_PROVIDER || 'sendinblue',
      sendinblue: {
        apiKey: process.env.SENDINBLUE_API_KEY,
        templates: {
          accountCreationTemplateId: process.env.SENDINBLUE_ACCOUNT_CREATION_TEMPLATE_ID,
          organizationInvitationTemplateId: process.env.SENDINBLUE_ORGANIZATION_INVITATION_TEMPLATE_ID,
          organizationInvitationScoTemplateId: process.env.SENDINBLUE_ORGANIZATION_INVITATION_SCO_TEMPLATE_ID,
          passwordResetTemplateId: process.env.SENDINBLUE_PASSWORD_RESET_TEMPLATE_ID,
          certificationResultTemplateId: process.env.SENDINBLUE_CERTIFICATION_RESULT_TEMPLATE_ID,
          accountRecoveryTemplateId: process.env.SENDINBLUE_ACCOUNT_RECOVERY_TEMPLATE_ID,
          emailVerificationCodeTemplateId: process.env.SENDINBLUE_EMAIL_VERIFICATION_CODE_TEMPLATE_ID,
        },
      },
    },

    authentication: {
      secret: process.env.AUTH_SECRET,
      accessTokenLifespanMs: ms(process.env.ACCESS_TOKEN_LIFESPAN || '20m'),
      refreshTokenLifespanMs: ms(process.env.REFRESH_TOKEN_LIFESPAN || '7d'),
      tokenForCampaignResultLifespan: '1h',
      tokenForStudentReconciliationLifespan: '1h',
    },

    apiManager: {
      url: process.env.APIM_URL || 'https://gateway.pix.fr',
    },

    jwtConfig: {
      livretScolaire: {
        secret: process.env.LIVRET_SCOLAIRE_AUTH_SECRET,
        tokenLifespan: process.env.TOKEN_LIFE_SPAN || '1h',
      },
      poleEmploi: {
        secret: process.env.POLE_EMPLOI_AUTH_SECRET,
        tokenLifespan: process.env.TOKEN_LIFE_SPAN || '1h',
      },
    },

    saml: {
      spConfig: parseJSONEnv('SAML_SP_CONFIG'),
      idpConfig: parseJSONEnv('SAML_IDP_CONFIG'),
      attributeMapping: parseJSONEnv('SAML_ATTRIBUTE_MAPPING') || {
        samlId: 'IDO',
        firstName: 'PRE',
        lastName: 'NOM',
      },
      accessTokenLifespanMs: ms(process.env.SAML_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    temporaryKey: {
      secret: process.env.AUTH_SECRET,
      tokenLifespan: '1d',
      payload: 'PixResetPassword',
    },

    account: {
      passwordValidationPattern: '^(?=.*\\p{Lu})(?=.*\\p{Ll})(?=.*\\d).{8,}$',
    },

    bcryptNumberOfSaltRounds: _getNumber(process.env.BCRYPT_NUMBER_OF_SALT_ROUNDS, 10),

    availableCharacterForCode: {
      letters: 'BCDFGHJKMPQRTVWXY',
      numbers: '2346789',
    },

    rateLimit: {
      redisUrl: process.env.REDIS_URL,
      enabled: isFeatureEnabled(process.env.RATE_LIMIT_ENABLED),
      logOnly: isFeatureEnabled(process.env.RATE_LIMIT_LOG_ONLY),
      limit: _getNumber(process.env.RATE_LIMIT_DEFAULT_LIMIT, 10),
      window: _getNumber(process.env.RATE_LIMIT_DEFAULT_WINDOW, 60),
    },

    caching: {
      redisUrl: process.env.REDIS_URL,
      redisCacheKeyLockTTL: parseInt(process.env.REDIS_CACHE_KEY_LOCK_TTL, 10) || 60000,
      redisCacheLockedWaitBeforeRetry: parseInt(process.env.REDIS_CACHE_LOCKED_WAIT_BEFORE_RETRY, 10) || 1000,
    },

    features: {
      dayBeforeImproving: _getNumber(process.env.DAY_BEFORE_IMPROVING, 4),
      dayBeforeRetrying: _getNumber(process.env.DAY_BEFORE_RETRYING, 4),
      dayBeforeCompetenceResetV2: _getNumber(process.env.DAY_BEFORE_COMPETENCE_RESET_V2, 7),
      garAccessV2: isFeatureEnabled(process.env.GAR_ACCESS_V2),
      maxReachableLevel: _getNumber(process.env.MAX_REACHABLE_LEVEL, 5),
      newYearOrganizationLearnersImportDate: _getDate(process.env.NEW_YEAR_ORGANIZATION_LEARNERS_IMPORT_DATE),
      numberOfChallengesForFlashMethod: _getNumber(process.env.NUMBER_OF_CHALLENGES_FOR_FLASH_METHOD),
      pixCertifScoBlockedAccessWhitelist: getArrayOfStrings(process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_WHITELIST),
      pixCertifScoBlockedAccessDateLycee: process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_DATE_LYCEE,
      pixCertifScoBlockedAccessDateCollege: process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_DATE_COLLEGE,
      scoAccountRecoveryKeyLifetimeMinutes: process.env.SCO_ACCOUNT_RECOVERY_KEY_LIFETIME_MINUTES,
    },

    featureToggles: {
      isCertificationFreeFieldsDeletionEnabled: isFeatureEnabled(process.env.FT_CERTIFICATION_FREE_FIELDS_DELETION),
    },

    infra: {
      concurrencyForHeavyOperations: _getNumber(process.env.INFRA_CONCURRENCY_HEAVY_OPERATIONS, 2),
      chunkSizeForCampaignResultProcessing: _getNumber(process.env.INFRA_CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING, 10),
      chunkSizeForOrganizationLearnerDataProcessing: _getNumber(
        process.env.INFRA_CHUNK_SIZE_ORGANIZATION_LEARNER_DATA_PROCESSING,
        1000
      ),
    },

    sentry: {
      enabled: isFeatureEnabled(process.env.SENTRY_ENABLED),
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT || 'development',
      maxBreadcrumbs: _getNumber(process.env.SENTRY_MAX_BREADCRUMBS, 100),
      debug: isFeatureEnabled(process.env.SENTRY_DEBUG),
      maxValueLength: 1000,
    },

    poleEmploi: {
      clientId: process.env.POLE_EMPLOI_CLIENT_ID,
      clientSecret: process.env.POLE_EMPLOI_CLIENT_SECRET,
      tokenUrl: process.env.POLE_EMPLOI_TOKEN_URL,
      sendingUrl: process.env.POLE_EMPLOI_SENDING_URL,
      userInfoUrl: process.env.POLE_EMPLOI_USER_INFO_URL,
      authUrl: process.env.POLE_EMPLOI_OIDC_AUTHENTICATION_URL,
      temporaryStorage: {
        expirationDelaySeconds:
          parseInt(process.env.POLE_EMPLOI_TEMPORARY_STORAGE_EXPIRATION_DELAY_SECONDS, 10) || 1140,
        redisUrl: process.env.REDIS_URL,
      },
      poleEmploiSendingsLimit: _getNumber(process.env.POLE_EMPLOI_SENDING_LIMIT, 100),
      poleEmploiIdentityProvider: process.env.POLE_EMPLOI_IDENTITY_PROVIDER || 'POLE_EMPLOI',
      accessTokenLifespanMs: ms(process.env.POLE_EMPLOI_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    cnav: {
      clientId: process.env.CNAV_CLIENT_ID,
      authUrl: process.env.CNAV_AUTHENTICATION_URL,
      tokenUrl: process.env.CNAV_TOKEN_URL,
      clientSecret: process.env.CNAV_CLIENT_SECRET,
      accessTokenLifespanMs: ms(process.env.CNAV_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    authenticationSession: {
      temporaryStorage: {
        expirationDelaySeconds:
          parseInt(process.env.AUTHENTICATION_SESSION_TEMPORARY_STORAGE_EXP_DELAY_SECONDS, 10) || 1140,
      },
    },

    temporaryStorage: {
      expirationDelaySeconds: parseInt(process.env.TEMPORARY_STORAGE_EXPIRATION_DELAY_SECONDS, 10) || 600,
      redisUrl: process.env.REDIS_URL,
    },

    graviteeRegisterApplicationsCredentials: [
      {
        clientId: process.env.LSU_CLIENT_ID,
        clientSecret: process.env.LSU_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'lsu',
      },
      {
        clientId: process.env.LSL_CLIENT_ID,
        clientSecret: process.env.LSL_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'lsl',
      },
      {
        clientId: process.env.GRAVITEE_OSMOSE_CLIENT_ID,
        clientSecret: process.env.GRAVITEE_OSMOSE_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'livretScolaire',
      },
      {
        clientId: process.env.GRAVITEE_POLE_EMPLOI_CLIENT_ID,
        clientSecret: process.env.GRAVITEE_POLE_EMPLOI_CLIENT_SECRET,
        scope: 'pole-emploi-participants-result',
        source: 'poleEmploi',
      },
    ],
  };

  if (config.environment === 'development') {
    config.logging.enabled = true;
  } else if (process.env.NODE_ENV === 'test') {
    config.port = 0;

    config.lcms.apiKey = 'test-api-key';
    config.lcms.url = 'https://lcms-test.pix.fr/api';

    config.domain.tldFr = '.fr';
    config.domain.tldOrg = '.org';
    config.domain.pix = 'https://pix';
    config.domain.pixOrga = 'https://orga.pix';

    config.features.dayBeforeRetrying = 4;
    config.features.dayBeforeImproving = 4;
    config.features.dayBeforeCompetenceResetV2 = 7;
    config.features.garAccessV2 = false;
    config.features.numberOfChallengesForFlashMethod = 10;
    config.features.pixCertifScoBlockedAccessDateLycee = null;
    config.features.pixCertifScoBlockedAccessDateCollege = null;

    config.featureToggles.isCertificationFreeFieldsDeletionEnabled = false;

    config.mailing.enabled = false;
    config.mailing.provider = 'sendinblue';

    config.mailing.sendinblue.apiKey = 'test-api-key';
    config.mailing.sendinblue.templates.accountCreationTemplateId = 'test-account-creation-template-id';
    config.mailing.sendinblue.templates.organizationInvitationTemplateId =
      'test-organization-invitation-demand-template-id';
    config.mailing.sendinblue.templates.organizationInvitationScoTemplateId =
      'test-organization-invitation-sco-demand-template-id';
    config.mailing.sendinblue.templates.certificationResultTemplateId = 'test-certification-result-template-id';
    config.mailing.sendinblue.templates.passwordResetTemplateId = 'test-password-reset-template-id';
    config.mailing.sendinblue.templates.emailChangeTemplateId = 'test-email-change-template-id';
    config.mailing.sendinblue.templates.accountRecoveryTemplateId = 'test-account-recovery-template-id';
    config.mailing.sendinblue.templates.emailVerificationCodeTemplateId = 'test-email-verification-code-template-id';

    config.bcryptNumberOfSaltRounds = 1;

    config.authentication.secret = 'test-jwt-key';

    config.temporaryKey.secret = 'test-jwt-key';

    config.poleEmploi.clientId = 'PIX_POLE_EMPLOI_CLIENT_ID';
    config.poleEmploi.clientSecret = 'PIX_POLE_EMPLOI_CLIENT_SECRET';
    config.poleEmploi.tokenUrl = 'http://tokenUrl.fr';
    config.poleEmploi.sendingUrl = 'http://sendingUrl.fr';
    config.poleEmploi.userInfoUrl = 'http://userInfoUrl.fr';
    config.poleEmploi.authUrl = 'http://authurl.fr';
    config.poleEmploi.temporaryStorage.redisUrl = null;

    config.temporaryStorage.redisUrl = null;

    config.cnav.clientId = 'PIX_CNAV_CLIENT_ID';
    config.cnav.authUrl = 'http://idp.cnav/auth';
    config.cnav.tokenUrl = 'http://idp.cnav/token';
    config.cnav.clientSecret = 'PIX_CNAV_CLIENT_SECRET';

    config.saml.accessTokenLifespanMs = 1000;

    config.graviteeRegisterApplicationsCredentials = [
      {
        clientId: 'lsuClientId',
        clientSecret: 'lsuClientSecret',
        scope: 'organizations-certifications-result',
        source: 'lsu',
      },
      {
        clientId: 'lslClientId',
        clientSecret: 'lslClientSecret',
        scope: 'organizations-certifications-result',
        source: 'lsl',
      },
      {
        clientId: 'graviteeOsmoseClientId',
        clientSecret: 'graviteeOsmoseClientSecret',
        scope: 'organizations-certifications-result',
        source: 'livretScolaire',
      },
      {
        clientId: 'poleEmploiClientId',
        clientSecret: 'poleEmploiClientSecret',
        scope: 'pole-emploi-participants-result',
        source: 'poleEmploi',
      },
    ];

    config.jwtConfig.livretScolaire = { secret: 'secretosmose', tokenLifespan: '1h' };
    config.jwtConfig.poleEmploi = { secret: 'secretPoleEmploi', tokenLifespan: '1h' };

    config.logging.enabled = isBooleanFeatureEnabledElseDefault(process.env.TEST_LOG_ENABLED, false);
    config.logging.enableLogKnexQueries = false;
    config.logging.enableLogStartingEventDispatch = false;
    config.logging.enableLogEndingEventDispatch = false;

    config.caching.redisUrl = null;
    config.caching.redisCacheKeyLockTTL = 0;
    config.caching.redisCacheLockedWaitBeforeRetry = 0;

    config.rateLimit.redisUrl = process.env.TEST_REDIS_URL;

    config.sentry.enabled = false;

    config.redis = {
      url: process.env.TEST_REDIS_URL,
      database: 1,
    };
  }

  return config;
})();
/* eslint-enable node/no-process-env*/
