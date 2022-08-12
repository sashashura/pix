// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  return knex('badge-criteria').update({ scope: 'SkillSet' }).where({ scope: 'SomePartnerCompetences' });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex('badge-criteria').update({ scope: 'SomePartnerCompetences' }).where({ scope: 'SkillSet' });
};
