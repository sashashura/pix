// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorial = require('../../domain/models/UserSavedTutorial');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'user-saved-tutorials';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async addTutorial({
    userId,
    tutorialId,
    skillId
  }: $TSFixMe) {
    const userSavedTutorials = await knex(TABLE_NAME).where({ userId, tutorialId });
    if (userSavedTutorials.length) {
      return _toDomain(userSavedTutorials[0]);
    }
    const savedUserSavedTutorials = await knex(TABLE_NAME).insert({ userId, tutorialId, skillId }).returning('*');
    return _toDomain(savedUserSavedTutorials[0]);
  },

  async find({
    userId
  }: $TSFixMe) {
    const userSavedTutorials = await knex(TABLE_NAME).where({ userId }).orderBy('createdAt', 'desc');
    return userSavedTutorials.map(_toDomain);
  },

  async removeFromUser(userSavedTutorial: $TSFixMe) {
    return knex(TABLE_NAME).where(userSavedTutorial).delete();
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(userSavedTutorial: $TSFixMe) {
  return new UserSavedTutorial({
    id: userSavedTutorial.id,
    tutorialId: userSavedTutorial.tutorialId,
    userId: userSavedTutorial.userId,
    skillId: userSavedTutorial.skillId,
    createdAt: userSavedTutorial.createdAt,
  });
}
