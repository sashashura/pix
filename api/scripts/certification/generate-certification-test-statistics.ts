// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fp'.
const fp = require('lodash/fp').convert({ cap: false });
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../lib/infrastructure/repositories/competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../lib/infrastructure/repositories/challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../../lib/domain/services/placement-profile-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationChallengeService = require('../../lib/domain/services/certification-challenges-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const USER_COUNT = parseInt(process.env.USER_COUNT) || 100;
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const USER_ID = parseInt(process.env.USER_ID) || null;

// Exemple d'utilisation :
// $ LOG_ENABLED=FALSE PGSSLMODE=require NODE_TLS_REJECT_UNAUTHORIZED='0' USER_COUNT=1000 node scripts/generate-certification-test-statistics.js > branch.log
//
// Voir aussi :
// - https://1024pix.atlassian.net/wiki/spaces/DEV/pages/1855422507/2020-09-28+G+n+rer+des+stats+sur+les+tests+de+certif

function makeRefDataFaster() {
  challengeRepository.list = _.memoize(challengeRepository.findOperative);
  competenceRepository.list = _.memoize(competenceRepository.list);
  competenceRepository.listPixCompetencesOnly = _.memoize(competenceRepository.listPixCompetencesOnly);
}

makeRefDataFaster();

async function _retrieveUserIds() {
  const result = await knex.raw(
    `
    SELECT "users"."id"
    FROM "users"
    JOIN "certification-courses" ON "certification-courses"."userId" = "users"."id"
    ORDER BY "users"."id" DESC
    LIMIT ?;
  `,
    USER_COUNT
  );
  return _.map(result.rows, 'id');
}

async function _generateCertificationTest(userId: $TSFixMe, competences: $TSFixMe) {
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, competences });
  if (!placementProfile.isCertifiable()) {
    throw new Error('pas certifiable');
  }

  const certificationChallenges = await certificationChallengeService.pickCertificationChallenges(
    placementProfile,
    FRENCH_FRANCE
  );
  if (USER_ID) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(JSON.stringify(certificationChallenges, null, 2));
  }

  fp.flow(
    fp.groupBy('competenceId'),
    fp.mapValues((ccs: $TSFixMe) => ccs.map((cc: $TSFixMe) => cc.associatedSkillName.slice(-1)).join(':')),
    fp.map((levels: $TSFixMe, competenceId: $TSFixMe) => `${userId}\t${competenceId}\t${levels}`),
    fp.sortBy(fp.identity),
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    fp.forEach((line: $TSFixMe) => console.log(line))
  )(certificationChallenges);

  const certificationChallengesCountByCompetenceId = _.countBy(certificationChallenges, 'competenceId');

  return _.fromPairs(
    _.map(placementProfile.userCompetences, (userCompetence: $TSFixMe) => {
      if (userCompetence.isCertifiable()) {
        return [userCompetence.id, certificationChallengesCountByCompetenceId[userCompetence.id]];
      }
      return [userCompetence.id, 'non-certifiable'];
    })
  );
}

function updateProgress() {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.stderr.write('.');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    let userIds;
    if (USER_ID) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(`userId: ${USER_ID}`);
      userIds = [USER_ID];
    } else {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(`Récupération de ${USER_COUNT} utilisateurs certifiables...`);
      userIds = await _retrieveUserIds();
    }
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('Récupération OK');
    const competences = await competenceRepository.listPixCompetencesOnly();
    let nonCertifiableUserCount = 0;

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('Génération des tests de certification : ');
    const certificationTestsByUser = _.compact(
      await bluebird.mapSeries(
        userIds,
        async (userId: $TSFixMe) => {
          try {
            const challengeCountByCompetence = await _generateCertificationTest(userId, competences);
            return {
              userId,
              challengeCountByCompetence,
            };
          } catch (err) {
            // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
            console.error(`Erreur de génération pour le user : ${userId}`, err);
            ++nonCertifiableUserCount;
            return null;
          } finally {
            updateProgress();
          }
        },
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        { concurrency: ~~process.env.CONCURRENCY || 10 }
      )
    );

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\nGénération des tests de certification OK');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('Génération des statistiques...');
    const competenceIds = _.map(competences, 'id');
    const allChallengeCountByCompetence = _.map(certificationTestsByUser, 'challengeCountByCompetence');
    const challengeCountByCompetenceTotal = _.map(competenceIds, (competenceId: $TSFixMe) => {
      return [competenceId, _.countBy(allChallengeCountByCompetence, competenceId)];
    });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Utilisateurs non certifiables : ', nonCertifiableUserCount);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(_.fromPairs(challengeCountByCompetenceTotal));
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(error);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
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
