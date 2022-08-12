// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildKnowl... Remove this comment to see the full error message
const buildKnowledgeElement = require('./build-knowledge-element');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildKnowledgeElementSnapshot({
  id = databaseBuffer.getNextId(),
  userId,
  snappedAt = new Date('2020-01-01'),
  snapshot
}: $TSFixMe = {}) {
  const dateMinusOneDay = new Date(snappedAt.getTime() - 1000 * 60 * 60 * 24 * 7);
  userId = _.isUndefined(userId) ? buildUser().id : userId;
  if (!snapshot) {
    const knowledgeElements = [];
    knowledgeElements.push(buildKnowledgeElement({ userId, createdAt: dateMinusOneDay }));
    knowledgeElements.push(buildKnowledgeElement({ userId, createdAt: dateMinusOneDay }));
    snapshot = JSON.stringify(knowledgeElements);
  }

  const values = {
    id,
    userId,
    snappedAt,
    snapshot,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'knowledge-element-snapshots',
    values,
  });
};
