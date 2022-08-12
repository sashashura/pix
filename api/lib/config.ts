/* eslint-disable node/no-process-env*/
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ms = require('ms');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getArrayOf... Remove this comment to see the full error message
const { getArrayOfStrings } = require('../lib/infrastructure/utils/string-utils');

function parseJSONEnv(varName: $TSFixMe) {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  if (process.env[varName]) {
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    return JSON.parse(process.env[varName]);
  }
  return undefined;
}

function isFeatureEnabled(environmentVariable: $TSFixMe) {
  return environmentVariable === 'true';
}

function isBooleanFeatureEnabledElseDefault(environmentVariable: $TSFixMe, defaultValue: $TSFixMe) {
  return environmentVariable === 'true' ? true : defaultValue;
}

function _getNumber(numberAsString: $TSFixMe, defaultIntNumber: $TSFixMe) {
  const number = parseInt(numberAsString, 10);
  return isNaN(number) ? defaultIntNumber : number;
}

function _getDate(dateAsString: $TSFixMe) {
  if (!dateAsString) {
    return null;
  }
  const dateAsMoment = moment(dateAsString);
  if (!dateAsMoment.isValid()) {
    return null;
  }

  return dateAsMoment.toDate();
}

function _removeTrailingSlashFromUrl(url: $TSFixMe) {
  return url.replace(/\/$/, '');
}

function _getLogForHumans() {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const processOutputingToTerminal = process.stdout.isTTY;
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const forceJSONLogs = process.env.LOG_FOR_HUMANS === 'false';
  return processOutputingToTerminal && !forceJSONLogs;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (function () {
  const config = {
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    rootPath: path.normalize(__dirname + '/..'),

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    port: parseInt(process.env.PORT, 10) || 3000,

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    environment: process.env.NODE_ENV || 'development',

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    logOpsMetrics: isFeatureEnabled(process.env.LOG_OPS_METRICS),

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    version: process.env.CONTAINER_VERSION || 'development',

    hapi: {
      options: {},
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableRequestMonitoring: isFeatureEnabled(process.env.ENABLE_REQUEST_MONITORING),
    },

    domain: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      tldFr: process.env.TLD_FR || '.fr',
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      tldOrg: process.env.TLD_ORG || '.org',
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pix: process.env.DOMAIN_PIX || 'https://pix',
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixApp: process.env.DOMAIN_PIX_APP || 'https://app.pix',
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixOrga: process.env.DOMAIN_PIX_ORGA || 'https://orga.pix',
    },

    lcms: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      url: _removeTrailingSlashFromUrl(process.env.CYPRESS_LCMS_API_URL || process.env.LCMS_API_URL || ''),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      apiKey: process.env.CYPRESS_LCMS_API_KEY || process.env.LCMS_API_KEY,
    },

    logging: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enabled: isFeatureEnabled(process.env.LOG_ENABLED),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      logLevel: process.env.LOG_LEVEL || 'info',
      logForHumans: _getLogForHumans(),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableLogKnexQueries: isFeatureEnabled(process.env.LOG_KNEX_QUERIES),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableLogStartingEventDispatch: isFeatureEnabled(process.env.LOG_STARTING_EVENT_DISPATCH),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableLogEndingEventDispatch: isFeatureEnabled(process.env.LOG_ENDING_EVENT_DISPATCH),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      emitOpsEventEachSeconds: isFeatureEnabled(process.env.OPS_EVENT_EACH_SECONDS) || 15,
    },

    mailing: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enabled: isFeatureEnabled(process.env.MAILING_ENABLED),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      provider: process.env.MAILING_PROVIDER || 'sendinblue',
      sendinblue: {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        apiKey: process.env.SENDINBLUE_API_KEY,
        templates: {
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          accountCreationTemplateId: process.env.SENDINBLUE_ACCOUNT_CREATION_TEMPLATE_ID,
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          organizationInvitationTemplateId: process.env.SENDINBLUE_ORGANIZATION_INVITATION_TEMPLATE_ID,
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          organizationInvitationScoTemplateId: process.env.SENDINBLUE_ORGANIZATION_INVITATION_SCO_TEMPLATE_ID,
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          passwordResetTemplateId: process.env.SENDINBLUE_PASSWORD_RESET_TEMPLATE_ID,
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          certificationResultTemplateId: process.env.SENDINBLUE_CERTIFICATION_RESULT_TEMPLATE_ID,
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          accountRecoveryTemplateId: process.env.SENDINBLUE_ACCOUNT_RECOVERY_TEMPLATE_ID,
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          emailVerificationCodeTemplateId: process.env.SENDINBLUE_EMAIL_VERIFICATION_CODE_TEMPLATE_ID,
        },
      },
    },

    authentication: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      secret: process.env.AUTH_SECRET,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      accessTokenLifespanMs: ms(process.env.ACCESS_TOKEN_LIFESPAN || '20m'),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      refreshTokenLifespanMs: ms(process.env.REFRESH_TOKEN_LIFESPAN || '7d'),
      tokenForCampaignResultLifespan: '1h',
      tokenForStudentReconciliationLifespan: '1h',
      passwordResetTokenLifespan: '1h',
    },

    apiManager: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      url: process.env.APIM_URL || 'https://gateway.pix.fr',
    },

    jwtConfig: {
      livretScolaire: {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        secret: process.env.LIVRET_SCOLAIRE_AUTH_SECRET,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        tokenLifespan: process.env.TOKEN_LIFE_SPAN || '1h',
      },
      poleEmploi: {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        secret: process.env.POLE_EMPLOI_AUTH_SECRET,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      accessTokenLifespanMs: ms(process.env.SAML_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    temporaryKey: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      secret: process.env.AUTH_SECRET,
      tokenLifespan: '1d',
      payload: 'PixResetPassword',
    },

    account: {
      passwordValidationPattern: '^(?=.*\\p{Lu})(?=.*\\p{Ll})(?=.*\\d).{8,}$',
    },

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    bcryptNumberOfSaltRounds: _getNumber(process.env.BCRYPT_NUMBER_OF_SALT_ROUNDS, 10),

    availableCharacterForCode: {
      letters: 'BCDFGHJKMPQRTVWXY',
      numbers: '2346789',
    },

    rateLimit: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      redisUrl: process.env.REDIS_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enabled: isFeatureEnabled(process.env.RATE_LIMIT_ENABLED),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      logOnly: isFeatureEnabled(process.env.RATE_LIMIT_LOG_ONLY),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      limit: _getNumber(process.env.RATE_LIMIT_DEFAULT_LIMIT, 10),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      window: _getNumber(process.env.RATE_LIMIT_DEFAULT_WINDOW, 60),
    },

    caching: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      redisUrl: process.env.REDIS_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      redisCacheKeyLockTTL: parseInt(process.env.REDIS_CACHE_KEY_LOCK_TTL, 10) || 60000,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      redisCacheLockedWaitBeforeRetry: parseInt(process.env.REDIS_CACHE_LOCKED_WAIT_BEFORE_RETRY, 10) || 1000,
    },
    pgBoss: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      connexionPoolMaxSize: parseInt(process.env.PGBOSS_CONNECTION_POOL_MAX_SIZE, 10) || 2,
    },
    features: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dayBeforeImproving: _getNumber(process.env.DAY_BEFORE_IMPROVING, 4),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dayBeforeRetrying: _getNumber(process.env.DAY_BEFORE_RETRYING, 4),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dayBeforeCompetenceResetV2: _getNumber(process.env.DAY_BEFORE_COMPETENCE_RESET_V2, 7),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      garAccessV2: isFeatureEnabled(process.env.GAR_ACCESS_V2),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      maxReachableLevel: _getNumber(process.env.MAX_REACHABLE_LEVEL, 5),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      newYearOrganizationLearnersImportDate: _getDate(process.env.NEW_YEAR_ORGANIZATION_LEARNERS_IMPORT_DATE),
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      numberOfChallengesForFlashMethod: _getNumber(process.env.NUMBER_OF_CHALLENGES_FOR_FLASH_METHOD),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixCertifScoBlockedAccessWhitelist: getArrayOfStrings(process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_WHITELIST),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixCertifScoBlockedAccessDateLycee: process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_DATE_LYCEE,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixCertifScoBlockedAccessDateCollege: process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_DATE_COLLEGE,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      scoAccountRecoveryKeyLifetimeMinutes: process.env.SCO_ACCOUNT_RECOVERY_KEY_LIFETIME_MINUTES,
    },

    featureToggles: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      isPixAppTutoFiltersEnabled: isFeatureEnabled(process.env.FT_TUTOS_V2_1_FILTERS),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      isSsoAccountReconciliationEnabled: isFeatureEnabled(process.env.FT_SSO_ACCOUNT_RECONCILIATION),
    },

    infra: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      concurrencyForHeavyOperations: _getNumber(process.env.INFRA_CONCURRENCY_HEAVY_OPERATIONS, 2),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      chunkSizeForCampaignResultProcessing: _getNumber(process.env.INFRA_CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING, 10),
      chunkSizeForOrganizationLearnerDataProcessing: _getNumber(
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.env.INFRA_CHUNK_SIZE_ORGANIZATION_LEARNER_DATA_PROCESSING,
        1000
      ),
    },

    sentry: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enabled: isFeatureEnabled(process.env.SENTRY_ENABLED),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dsn: process.env.SENTRY_DSN,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      environment: process.env.SENTRY_ENVIRONMENT || 'development',
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      maxBreadcrumbs: _getNumber(process.env.SENTRY_MAX_BREADCRUMBS, 100),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      debug: isFeatureEnabled(process.env.SENTRY_DEBUG),
      maxValueLength: 1000,
    },

    poleEmploi: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      clientId: process.env.POLE_EMPLOI_CLIENT_ID,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      clientSecret: process.env.POLE_EMPLOI_CLIENT_SECRET,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      tokenUrl: process.env.POLE_EMPLOI_TOKEN_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      sendingUrl: process.env.POLE_EMPLOI_SENDING_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      userInfoUrl: process.env.POLE_EMPLOI_OIDC_USER_INFO_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      authenticationUrl: process.env.POLE_EMPLOI_OIDC_AUTHENTICATION_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      logoutUrl: process.env.POLE_EMPLOI_OIDC_LOGOUT_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      afterLogoutUrl: process.env.POLE_EMPLOI_OIDC_AFTER_LOGOUT_URL,
      temporaryStorage: {
        expirationDelaySeconds:
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          parseInt(process.env.POLE_EMPLOI_TEMPORARY_STORAGE_EXPIRATION_DELAY_SECONDS, 10) || 1140,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        redisUrl: process.env.REDIS_URL,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        idTokenLifespanMs: ms(process.env.POLE_EMPLOI_ID_TOKEN_LIFESPAN || '7d'),
      },
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      poleEmploiSendingsLimit: _getNumber(process.env.POLE_EMPLOI_SENDING_LIMIT, 100),
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      poleEmploiIdentityProvider: process.env.POLE_EMPLOI_IDENTITY_PROVIDER || 'POLE_EMPLOI',
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      accessTokenLifespanMs: ms(process.env.POLE_EMPLOI_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    cnav: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      clientId: process.env.CNAV_CLIENT_ID,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      authenticationUrl: process.env.CNAV_AUTHENTICATION_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      userInfoUrl: process.env.CNAV_OIDC_USER_INFO_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      tokenUrl: process.env.CNAV_TOKEN_URL,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      clientSecret: process.env.CNAV_CLIENT_SECRET,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      accessTokenLifespanMs: ms(process.env.CNAV_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    authenticationSession: {
      temporaryStorage: {
        expirationDelaySeconds:
          // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          parseInt(process.env.AUTHENTICATION_SESSION_TEMPORARY_STORAGE_EXP_DELAY_SECONDS, 10) || 1140,
      },
    },

    temporaryStorage: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      expirationDelaySeconds: parseInt(process.env.TEMPORARY_STORAGE_EXPIRATION_DELAY_SECONDS, 10) || 600,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      redisUrl: process.env.REDIS_URL,
    },

    graviteeRegisterApplicationsCredentials: [
      {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.LSU_CLIENT_ID,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.LSU_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'lsu',
      },
      {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.LSL_CLIENT_ID,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.LSL_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'lsl',
      },
      {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.GRAVITEE_OSMOSE_CLIENT_ID,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.GRAVITEE_OSMOSE_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'livretScolaire',
      },
      {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.GRAVITEE_POLE_EMPLOI_CLIENT_ID,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.GRAVITEE_POLE_EMPLOI_CLIENT_SECRET,
        scope: 'pole-emploi-participants-result',
        source: 'poleEmploi',
      },
    ],

    cpf: {
      idClient: '03VML243',
      idContrat: 'MCFCER000209',
      codeFranceConnect: 'RS5875',
      storage: {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        accessKeyId: process.env.CPF_STORAGE_ACCESS_KEY_ID,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        secretAccessKey: process.env.CPF_STORAGE_SECRET_ACCESS_KEY,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        endpoint: process.env.CPF_STORAGE_ENDPOINT,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        region: process.env.CPF_STORAGE_REGION,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        bucket: process.env.CPF_STORAGE_BUCKET_NAME,
      },
      plannerJob: {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        chunkSize: process.env.CPF_PLANNER_JOB_CHUNK_SIZE || 50000,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        monthsToProcess: process.env.CPF_PLANNER_JOB_MONTHS_TO_PROCESS || 1,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        minimumReliabilityPeriod: process.env.CPF_PLANNER_JOB_MINIMUM_RELIABILITY_PERIOD || 3,
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        cron: process.env.CPF_PLANNER_JOB_CRON,
      },
    },
  };

  if (config.environment === 'development') {
    config.logging.enabled = true;
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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

    config.featureToggles.isPixAppTutoFiltersEnabled = false;
    config.featureToggles.isSsoAccountReconciliationEnabled = false;

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
    (config.mailing.sendinblue.templates as $TSFixMe).emailChangeTemplateId = 'test-email-change-template-id';
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
    config.poleEmploi.authenticationUrl = 'http://authurl.fr';
    config.poleEmploi.logoutUrl = 'http://logout-url.fr';
    config.poleEmploi.afterLogoutUrl = 'http://after-logout.url';
    config.poleEmploi.temporaryStorage.redisUrl = null;

    config.temporaryStorage.redisUrl = null;

    config.cnav.clientId = 'PIX_CNAV_CLIENT_ID';
    config.cnav.authenticationUrl = 'http://idp.cnav/auth';
    config.cnav.userInfoUrl = 'http://userInfoUrl.fr';
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

    config.cpf.storage = {
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      endpoint: 'http://fake.endpoint.example.net',
      region: 'region',
      bucket: 'bucket',
    };

    config.jwtConfig.livretScolaire = { secret: 'secretosmose', tokenLifespan: '1h' };
    config.jwtConfig.poleEmploi = { secret: 'secretPoleEmploi', tokenLifespan: '1h' };

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    config.logging.enabled = isBooleanFeatureEnabledElseDefault(process.env.TEST_LOG_ENABLED, false);
    config.logging.enableLogKnexQueries = false;
    config.logging.enableLogStartingEventDispatch = false;
    config.logging.enableLogEndingEventDispatch = false;

    config.caching.redisUrl = null;
    config.caching.redisCacheKeyLockTTL = 0;
    config.caching.redisCacheLockedWaitBeforeRetry = 0;

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    config.rateLimit.redisUrl = process.env.TEST_REDIS_URL;

    config.sentry.enabled = false;

    (config as $TSFixMe).redis = {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    url: process.env.TEST_REDIS_URL,
    database: 1,
};
  }

  return config;
})();
/* eslint-enable node/no-process-env*/
