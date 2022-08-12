const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_SUPER_... Remove this comment to see the full error message
  PIX_SUPER_ADMIN_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_SUPPOR... Remove this comment to see the full error message
  PIX_SUPPORT_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_METIER... Remove this comment to see the full error message
  PIX_METIER_ID,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_CERTIF... Remove this comment to see the full error message
  PIX_CERTIF_ID,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./users-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../lib/domain/constants').PIX_ADMIN;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function pixAdminRolesBuilder({
  databaseBuilder
}: $TSFixMe) {
  databaseBuilder.factory.buildPixAdminRole({ userId: PIX_SUPER_ADMIN_ID, role: ROLES.SUPER_ADMIN });
  databaseBuilder.factory.buildPixAdminRole({ userId: PIX_SUPPORT_ID, role: ROLES.SUPPORT });
  databaseBuilder.factory.buildPixAdminRole({ userId: PIX_METIER_ID, role: ROLES.METIER });
  databaseBuilder.factory.buildPixAdminRole({ userId: PIX_CERTIF_ID, role: ROLES.CERTIF });
};
