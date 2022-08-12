// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'competence-marks';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'competenceId';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.string(COLUMN_NAME);
  });
  return knex.raw(
    `
  UPDATE ?? SET ?? = CASE ??
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  WHEN ? THEN ?
  ELSE NULL END
  `,
    [
      TABLE_NAME,
      COLUMN_NAME,
      'competence_code',
      '1.1',
      'recsvLz0W2ShyfD63',
      '1.2',
      'recIkYm646lrGvLNT',
      '1.3',
      'recNv8qhaY887jQb2',
      '2.1',
      'recDH19F7kKrfL3Ii',
      '2.2',
      'recgxqQfz3BqEbtzh',
      '2.3',
      'recMiZPNl7V1hyE1d',
      '2.4',
      'recFpYXCKcyhLI3Nu',
      '3.1',
      'recOdC9UDVJbAXHAm',
      '3.2',
      'recbDTF8KwupqkeZ6',
      '3.3',
      'recHmIWG6D0huq6Kx',
      '3.4',
      'rece6jYwH4WEw549z',
      '4.1',
      'rec6rHqas39zvLZep',
      '4.2',
      'recofJCxg0NqTqTdP',
      '4.3',
      'recfr0ax8XrfvJ3ER',
      '5.1',
      'recIhdrmCuEmCDAzj',
      '5.2',
      'recudHE5Omrr10qrx',
    ]
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME);
  });
};
