// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_DUPL... Remove this comment to see the full error message
const PGSQL_DUPLICATE_DATABASE_ERROR = '42P04';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_NON_... Remove this comment to see the full error message
const PGSQL_NON_EXISTENT_DATABASE_ERROR = '3D000';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_UNIQ... Remove this comment to see the full error message
const PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR = '23505';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_FORE... Remove this comment to see the full error message
const PGSQL_FOREIGN_KEY_VIOLATION_ERROR = '23503';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  PGSQL_DUPLICATE_DATABASE_ERROR,
  PGSQL_NON_EXISTENT_DATABASE_ERROR,
  PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR,
  PGSQL_FOREIGN_KEY_VIOLATION_ERROR,
};
