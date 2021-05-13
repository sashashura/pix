exports.up = async function(knex) {
  await knex.raw('CREATE VIEW "answers_shuffled" AS SELECT * FROM "answers" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "assessment-results_shuffled" AS SELECT * FROM "assessment-results" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "assessments_shuffled" AS SELECT * FROM "assessments" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "authentication-methods_shuffled" AS SELECT * FROM "authentication-methods" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "badge-acquisitions_shuffled" AS SELECT * FROM "badge-acquisitions" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "badge-criteria_shuffled" AS SELECT * FROM "badge-criteria" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "badge-partner-competences_shuffled" AS SELECT * FROM "badge-partner-competences" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "badges_shuffled" AS SELECT * FROM "badges" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "campaign-participations_shuffled" AS SELECT * FROM "campaign-participations" ORDER BY RANDOM()');
  await knex.raw('CREATE VIEW "campaigns_shuffled" AS SELECT * FROM "campaigns" ORDER BY RANDOM()');
};

exports.down = async function(knex) {
  await knex.raw('DROP VIEW "users_shuffled"');
  await knex.raw('DROP VIEW "assessment-results_shuffled"');
  await knex.raw('DROP VIEW "assessments_shuffled"');
  await knex.raw('DROP VIEW "authentication-methods_shuffled');
  await knex.raw('DROP VIEW "badge-acquisitions_shuffled"');
  await knex.raw('DROP VIEW "badge-criteria_shuffled"');
  await knex.raw('DROP VIEW "badge-partner-competences_shuffled"');
  await knex.raw('DROP VIEW "badges_shuffled"');
  await knex.raw('DROP VIEW "campaign-participations_shuffled"');
  await knex.raw('DROP VIEW "campaigns_shuffled"');
};
