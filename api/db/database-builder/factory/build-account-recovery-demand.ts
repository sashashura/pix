// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganizationLearner = require('./build-organization-learner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAccountRecoveryDemand({
  id = databaseBuffer.getNextId(),
  userId,
  firstName,
  lastName,
  organizationLearnerId,
  oldEmail,
  newEmail = 'philipe@example.net',
  temporaryKey = 'OWIxZGViNGQtM2I3ZC00YmFkLTliZGQtMmIwZDdiM2RjYjZk',
  used = false,
  createdAt = new Date(),
  updatedAt = new Date()
}: $TSFixMe = {}) {
  let organizationLearnerAttributes;
  let user;

  if (!userId) {
    user = buildUser();
    organizationLearnerAttributes = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      nationalStudentId: '123456789JJ',
    };
  } else {
    organizationLearnerAttributes = { userId, firstName, lastName, nationalStudentId: '123456789JJ' };
  }
  const actualOrganizationLearnerId =
    organizationLearnerId || buildOrganizationLearner(organizationLearnerAttributes).id;
  const actualUserId = userId || user.id;

  const values = {
    id,
    userId: actualUserId,
    organizationLearnerId: actualOrganizationLearnerId,
    oldEmail,
    newEmail,
    temporaryKey,
    used,
    createdAt,
    updatedAt,
  };

  databaseBuffer.pushInsertable({
    tableName: 'account-recovery-demands',
    values,
  });

  return {
    id,
    userId: actualUserId,
    organizationLearnerId: actualOrganizationLearnerId,
    oldEmail,
    newEmail,
    temporaryKey,
    used,
    createdAt,
    updatedAt,
  };
};
