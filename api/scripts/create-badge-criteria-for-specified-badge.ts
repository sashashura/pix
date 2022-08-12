('use strict');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../lib/domain/models/BadgeCriterion');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeRepos... Remove this comment to see the full error message
const badgeRepository = require('../lib/infrastructure/repositories/badge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaRepository = require('../lib/infrastructure/repositories/badge-criteria-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillSetRe... Remove this comment to see the full error message
const skillSetRepository = require('../lib/infrastructure/repositories/skill-set-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../db/knex-database-connection');

// Usage: node scripts/create-badge-criteria-for-specified-badge path/data.json
// data.json
// {
//   "badgeId": 112,
//   "criteria": [
//     {
//       "threshold": 23,
//       "scope": "CampaignParticipation",
//       "skillSetIds": null
//     },
//     {
//       "threshold": 26,
//       "scope": "SkillSet",
//       "skillSetIds": [100683, 100687]
//     }
//   ]
// }
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting creating badge criteria');

  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const filePath = process.argv[2];

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Reading json data file... ');
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  const jsonFile = require(filePath);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('ok');

  await checkBadgeExistence(jsonFile.badgeId);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Badge exists');

  checkCriteriaFormat(jsonFile.criteria);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('BadgeCriteria schema ok');

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Check skillSet');
  await bluebird.mapSeries(jsonFile.criteria, async (badgeCriterion: $TSFixMe) => {
    if (badgeCriterion.skillSetIds) {
      await checkSkillSetIds(badgeCriterion.skillSetIds);
    }
  });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Check skillSet ok');

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Creating badge criteria... ');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Saving badge criteria... ');
  return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
    await bluebird.mapSeries(jsonFile.criteria, (badgeCriterion: $TSFixMe) => {
      return _createBadgeCriterion({ ...badgeCriterion, badgeId: jsonFile.badgeId }, domainTransaction);
    });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkBadge... Remove this comment to see the full error message
async function checkBadgeExistence(badgeId: $TSFixMe) {
  try {
    await badgeRepository.get(badgeId);
  } catch (error) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Badge ${badgeId} not found`);
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCrite... Remove this comment to see the full error message
function checkCriteriaFormat(criteria: $TSFixMe) {
  const badgeCriterionSchema = Joi.object({
    threshold: Joi.number().min(0).max(100),
    scope: Joi.string().valid('CampaignParticipation', 'SkillSet'),
    skillSetIds: Joi.array().items(Joi.number()).min(1).allow(null),
  });

  criteria.forEach((badgeCriterion: $TSFixMe) => {
    const { error } = badgeCriterionSchema.validate(badgeCriterion);
    if (error) {
      throw error;
    }
    if (
      badgeCriterion.scope === BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION &&
      badgeCriterion.skillSetIds?.length > 0
    ) {
      throw new Error('Badge criterion is invalid : SkillSetIds provided for CampaignParticipation scope');
    }

    if (badgeCriterion.scope === BadgeCriterion.SCOPES.SKILL_SET && !badgeCriterion.skillSetIds) {
      throw new Error('Badge criterion is invalid : SkillSetIds should be provided for SkillSet scope');
    }
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkSkill... Remove this comment to see the full error message
async function checkSkillSetIds(skillSetIds: $TSFixMe) {
  const [{ count }] = await knex('skill-sets').count('*').whereIn('id', skillSetIds);
  if (count !== skillSetIds.length) {
    throw new Error('At least one skillSetId does not exist');
  }
}

async function _createBadgeCriterion(badgeCriterion: $TSFixMe, domainTransaction: $TSFixMe) {
  const newSkillSetIds = await copySkillSets({
    skillSetIds: badgeCriterion.skillSetIds,
    newBadgeId: badgeCriterion.badgeId,
  });
  return badgeCriteriaRepository.save(
    { badgeCriterion: { ...badgeCriterion, skillSetIds: newSkillSetIds } },
    domainTransaction
  );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'copySkillS... Remove this comment to see the full error message
async function copySkillSets({
  skillSetIds,
  newBadgeId
}: $TSFixMe) {
  const skillSets = await knex('skill-sets').select('name', 'skillIds').whereIn('id', skillSetIds);
  return bluebird.mapSeries(skillSets, async (skillSet: $TSFixMe) => {
    const savedSkillSet = await skillSetRepository.save({ skillSet: { ...skillSet, badgeId: newBadgeId } });
    return savedSkillSet.id;
  });
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main().then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { checkBadgeExistence, checkCriteriaFormat, checkSkillSetIds, copySkillSets };
