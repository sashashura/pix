#! /usr/bin/env node
'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../lib/infrastructure/caches/learning-content-cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const learningContentDatasource = require('../lib/infrastructure/datasources/learning-content/datasource');

logger.info('Starting refreshing Learning Content');
learningContentDatasource
  .refreshLearningContentCacheRecords()
  .then(() => {
    logger.info('Learning Content refreshed');
  })
  .catch((e: $TSFixMe) => logger.error('Error while reloading cache', e))
  .finally(() => cache.quit());
