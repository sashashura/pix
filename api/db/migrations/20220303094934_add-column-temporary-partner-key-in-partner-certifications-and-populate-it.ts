const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../lib/domain/models/Badge').keys;

const pixEduBadges = [
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
]
  .map((badge) => `'${badge}'`)
  .join(',');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.alterTable('partner-certifications', function (table: $TSFixMe) {
    table.string('partnerKey').nullable().alter();
    table.string('temporaryPartnerKey').references('badges.key').nullable();
  });

  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(
    `UPDATE "partner-certifications" SET "temporaryPartnerKey" = "partnerKey", "partnerKey" = NULL WHERE "partnerKey" IN (${pixEduBadges})`
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(
    `UPDATE "partner-certifications" SET "partnerKey" = "temporaryPartnerKey" WHERE "temporaryPartnerKey" IN (${pixEduBadges})`
  );

  await knex.schema.alterTable('partner-certifications', function (table: $TSFixMe) {
    table.dropColumn('temporaryPartnerKey');
    table.string('partnerKey').notNullable().alter();
  });
};
