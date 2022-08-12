// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config({ path: `${__dirname}/../../.env` });

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../lib/infrastructure/repositories/competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../../lib/infrastructure/repositories/skill-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computePar... Remove this comment to see the full error message
const computeParticipationResults = require('../prod/compute-participation-results');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getEligibl... Remove this comment to see the full error message
  getEligibleCampaignParticipations,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateKn... Remove this comment to see the full error message
  generateKnowledgeElementSnapshots,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../prod/generate-knowledge-element-snapshots-for-campaigns');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE } = CampaignParticipationStatuses;

const firstKECreatedAt = new Date('2020-05-01');
const secondKECreatedAt = new Date('2020-05-02');
const baseDate = new Date('2020-05-03');
let lowRAMMode = false;
let createOrganizationLearner = false;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'progressio... Remove this comment to see the full error message
let progression = 0;
function _logProgression(totalCount: $TSFixMe) {
  ++progression;
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.stdout.cursorTo(0);
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.stdout.write(`${Math.round((progression * 100) / totalCount, 2)} %`);
}

function _resetProgression() {
  progression = 0;
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _getChunkSize(objectToBeInserted: $TSFixMe) {
  // PostgreSQL autorise au maximum 65536 paramètres bindés dans les requêtes
  const MAX_BINDED_PG = 65536;
  if (objectToBeInserted) {
    return Math.floor(MAX_BINDED_PG / Object.keys(objectToBeInserted).length) - 1;
  }
  return MAX_BINDED_PG;
}

function _printUsage() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`
  node generate-campaign-with-participants.js [OPTIONS]
    --organizationId id                 : Id de l'organisation à laquelle on souhaite attacher la campagne
    --participantCount count            : Nombre de participants à la campagne
    --campaignType type                 : Type de la campagne (case insensitive). Valeurs possibles : assessment | profiles_collection
    --targetProfileId id                : Id du profil cible qu'on souhaite appliqué au parcours
                                          Ignoré si la campagne est de type profiles_collection
    --profileType type                  : Type du targetProfile (case insensitive). Valeurs possibles : light | medium | all
                                             light : 1 compétence, medium : la moitié des compétences, all : toutes les compétences
                                             Option ignorée si le type de la campagne est profiles_collection
                                             Option ignorée si un profil cible est spécifié via --targetProfileId
    --createOrganizationLearners      : Flag pour créer une organization-learner par participant
    --lowRAM                            : Flag optionnel. Indique que la machine dispose de peu de RAM. Réalise donc la même
                                             opération en consommant moins de RAM (opération ralentie).
    --help ou -h                        : Affiche l'aide`);
}

function _getIdentifier(uniqId: $TSFixMe) {
  return `_${Math.random().toString(36).substr(2, 9)}_${uniqId}`;
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _validateAndNormalizeOrganizationId(commandLineArgs: $TSFixMe) {
  const commandLineArgsLength = commandLineArgs.length;
  const organizationIdIndicatorIndex = commandLineArgs.findIndex(
    (commandLineArg: $TSFixMe) => commandLineArg === '--organizationId'
  );
  if (organizationIdIndicatorIndex === -1 || organizationIdIndicatorIndex + 1 >= commandLineArgsLength) {
    throw new Error("ID de l'organisation obligatoire.");
  }
  const organizationId = parseInt(commandLineArgs[organizationIdIndicatorIndex + 1]);
  if (isNaN(organizationId)) {
    throw new Error(
      `ID de l'organisation fourni ${commandLineArgs[organizationIdIndicatorIndex + 1]} n'est pas un entier.`
    );
  }
  return organizationId;
}

function _validateAndNormalizeTargetProfileId(commandLineArgs: $TSFixMe) {
  const commandLineArgsLength = commandLineArgs.length;
  const targetProfileIdIndicatorIndex = commandLineArgs.findIndex(
    (commandLineArg: $TSFixMe) => commandLineArg === '--targetProfileId'
  );
  if (targetProfileIdIndicatorIndex === -1 || targetProfileIdIndicatorIndex + 1 >= commandLineArgsLength) {
    return null;
  }
  const targetProfileId = parseInt(commandLineArgs[targetProfileIdIndicatorIndex + 1]);
  if (isNaN(targetProfileId)) {
    throw new Error(
      `ID du profil cible fourni ${commandLineArgs[targetProfileIdIndicatorIndex + 1]} n'est pas un entier.`
    );
  }
  return targetProfileId;
}

function _validateAndNormalizeParticipantCount(commandLineArgs: $TSFixMe) {
  const commandLineArgsLength = commandLineArgs.length;
  const participantCountIndicatorIndex = commandLineArgs.findIndex(
    (commandLineArg: $TSFixMe) => commandLineArg === '--participantCount'
  );
  if (participantCountIndicatorIndex === -1 || participantCountIndicatorIndex + 1 >= commandLineArgsLength) {
    throw new Error('Nombre de participants obligatoire.');
  }
  const participantCount = parseInt(commandLineArgs[participantCountIndicatorIndex + 1]);
  if (isNaN(participantCount)) {
    throw new Error(
      `Nombre de participations fourni ${commandLineArgs[participantCountIndicatorIndex + 1]} n'est pas un entier.`
    );
  }
  return participantCount;
}

function _validateAndNormalizeProfileType(commandLineArgs: $TSFixMe) {
  const commandLineArgsLength = commandLineArgs.length;
  const profileTypeIndicatorIndex = commandLineArgs.findIndex((commandLineArg: $TSFixMe) => commandLineArg === '--profileType');
  if (profileTypeIndicatorIndex === -1 || profileTypeIndicatorIndex + 1 >= commandLineArgsLength) {
    throw new Error('Type de profil obligatoire.');
  }
  const profileType = commandLineArgs[profileTypeIndicatorIndex + 1].toLowerCase();
  if (!['light', 'medium', 'all'].includes(profileType)) {
    throw new Error(
      `Type de profil doit être une valeur parmi light, medium et all, ${
        commandLineArgs[profileTypeIndicatorIndex + 1]
      } fourni.`
    );
  }
  return profileType;
}

function _validateAndNormalizeCampaignType(commandLineArgs: $TSFixMe) {
  const commandLineArgsLength = commandLineArgs.length;
  const campaignTypeIndicatorIndex = commandLineArgs.findIndex((commandLineArg: $TSFixMe) => commandLineArg === '--campaignType');
  if (campaignTypeIndicatorIndex === -1 || campaignTypeIndicatorIndex + 1 >= commandLineArgsLength) {
    throw new Error('Type de campagne obligatoire.');
  }
  const campaignType = commandLineArgs[campaignTypeIndicatorIndex + 1].toUpperCase();
  if (!['ASSESSMENT', 'PROFILES_COLLECTION'].includes(campaignType)) {
    throw new Error(
      `Type de campagne doit être une valeur parmi assessment et profiles_collection, ${
        commandLineArgs[campaignTypeIndicatorIndex + 1]
      } fourni.`
    );
  }
  return campaignType;
}

function _validateAndNormalizeArgs(commandLineArgs: $TSFixMe) {
  if (commandLineArgs.find((commandLineArg: $TSFixMe) => commandLineArg === '--help' || commandLineArg === '-h')) {
    _printUsage();
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(0);
  }
  if (commandLineArgs.find((commandLineArg: $TSFixMe) => commandLineArg === '--lowRAM')) {
    lowRAMMode = true;
  }
  if (commandLineArgs.find((commandLineArg: $TSFixMe) => commandLineArg === '--createOrganizationLearners')) {
    createOrganizationLearner = true;
  }
  const campaignType = _validateAndNormalizeCampaignType(commandLineArgs);
  const targetProfileId = _validateAndNormalizeTargetProfileId(commandLineArgs);
  return {
    organizationId: _validateAndNormalizeOrganizationId(commandLineArgs),
    targetProfileId: _validateAndNormalizeTargetProfileId(commandLineArgs),
    participantCount: _validateAndNormalizeParticipantCount(commandLineArgs),
    profileType:
      campaignType === 'ASSESSMENT' && !targetProfileId ? _validateAndNormalizeProfileType(commandLineArgs) : 'all',
    campaignType,
  };
}

async function _createTargetProfile({
  profileType
}: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Création du profil cible...');
  const competences = await competenceRepository.listPixCompetencesOnly();
  const competencesInProfile =
    profileType === 'light'
      ? [_.sample(competences)]
      : profileType === 'medium'
      ? _.sampleSize(competences, Math.round(competences.length / 2))
      : competences;
  const [targetProfileId] = await knex('target-profiles').returning('id').insert({ name: 'SomeTargetProfile' });
  for (const competence of competencesInProfile) {
    const skills = await skillRepository.findOperativeByCompetenceId(competence.id);
    for (const skill of skills) {
      await knex('target-profiles_skills').insert({ targetProfileId, skillId: skill.id });
    }
  }

  const targetProfile = await targetProfileRepository.get(targetProfileId);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
  return targetProfile;
}

async function _getTargetProfile(targetProfileId: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Récupération du profil cible existant...');
  const targetProfile = await targetProfileRepository.get(targetProfileId);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
  return targetProfile;
}

async function _createCampaign({
  organizationId,
  campaignType,
  targetProfileId
}: $TSFixMe) {
  const doesOrganizationExist = await knex('organizations').where({ id: organizationId }).first();
  if (!doesOrganizationExist) {
    throw new Error(`Organisation ${organizationId} n'existe pas.`);
  }
  const { userId: adminMemberId } = await knex
    .select('userId')
    .from('memberships')
    .where({ organizationId, organizationRole: 'ADMIN' })
    .first();
  if (!adminMemberId) {
    throw new Error(`Organisation ${organizationId} n'a pas de membre ADMIN.`);
  }
  const [campaignId] = await knex('campaigns')
    .returning('id')
    .insert({
      name: `Campaign_${organizationId}_${targetProfileId}`,
      code: 'FAKECODE',
      ownerId: 1,
      organizationId,
      creatorId: adminMemberId,
      targetProfileId,
      type: campaignType,
    });

  return campaignId;
}

async function _createUsers({
  count,
  uniqId,
  trx
}: $TSFixMe) {
  const userData = [];
  for (let i = 0; i < count; ++i) {
    const identifier = _getIdentifier(uniqId);
    userData.push({
      firstName: `firstName${identifier}`,
      lastName: `lastName${identifier}`,
      email: `email${identifier}@example.net`,
    });
  }
  const chunkSize = _getChunkSize(userData[0]);
  return trx.batchInsert('users', userData.flat(), chunkSize).returning('id');
}

async function _createOrganizationLearners({
  userIds,
  organizationId,
  uniqId,
  trx
}: $TSFixMe) {
  const { type } = await trx.select('type').from('organizations').where({ id: organizationId }).first();
  let organizationLearnerSpecificBuilder;
  switch (type) {
    case 'SCO':
      organizationLearnerSpecificBuilder = _buildSCOOrganizationLearner;
      break;
    case 'SUP': {
      organizationLearnerSpecificBuilder = _buildSUPOrganizationLearner;
      break;
    }
    case 'PRO': {
      organizationLearnerSpecificBuilder = _buildPROOrganizationLearner;
      break;
    }
    default:
      throw new Error(`L'organisation d'id ${organizationId} présente le type inconnu : ${type}`);
  }
  const organizationLearnerData = [];
  for (const userId of userIds) {
    const identifier = _getIdentifier(uniqId);
    organizationLearnerData.push(organizationLearnerSpecificBuilder({ userId, organizationId, identifier }));
  }
  const chunkSize = _getChunkSize(organizationLearnerData[0]);
  return trx.batchInsert('organization-learners', organizationLearnerData.flat(), chunkSize).returning('id');
}

function _buildBaseOrganizationLearner({
  userId,
  organizationId,
  identifier
}: $TSFixMe) {
  const birthdates = ['2001-01-05', '2002-11-15', '1995-06-25'];
  return {
    organizationId,
    userId,
    firstName: `firstName${identifier}`,
    lastName: `lastName${identifier}`,
    preferredLastName: `preferredLastName${identifier}`,
    middleName: `middleName${identifier}`,
    thirdName: `thirdName${identifier}`,
    birthdate: birthdates[_.random(0, 2)],
    birthCity: `birthCity${identifier}`,
    birthCityCode: `birthCityCode${identifier}`,
    birthCountryCode: `birthCountryCode${identifier}`,
    birthProvinceCode: `birthProvinceCode${identifier}`,
  };
}

function _buildSCOOrganizationLearner({
  userId,
  organizationId,
  identifier
}: $TSFixMe) {
  const divisions = ['3eme', '4eme', '5eme', '6eme'];
  return {
    ..._buildBaseOrganizationLearner({ userId, organizationId, identifier }),
    status: 'ST',
    nationalStudentId: `INE_${organizationId}_${identifier}`,
    division: divisions[_.random(0, 3)],
  };
}

function _buildSUPOrganizationLearner({
  userId,
  organizationId,
  identifier
}: $TSFixMe) {
  const diplomas = ['LICENCE', 'MASTER', 'DOCTORAT', 'DUT'];
  const groups = ['G1', 'G2', 'G3', 'G4'];
  return {
    ..._buildBaseOrganizationLearner({ userId, organizationId, identifier }),
    studentNumber: `NUMETU_${organizationId}_${identifier}`,
    diploma: diplomas[_.random(0, 3)],
    group: groups[_.random(0, 3)],
  };
}

function _buildPROOrganizationLearner({
  userId,
  organizationId,
  identifier
}: $TSFixMe) {
  return _buildBaseOrganizationLearner({ userId, organizationId, identifier });
}

async function _createAssessments({
  userAndCampaignParticipationIds,
  trx
}: $TSFixMe) {
  const assessmentData = [];
  for (const userAndCampaignParticipationId of userAndCampaignParticipationIds) {
    assessmentData.push({
      userId: userAndCampaignParticipationId.userId,
      campaignParticipationId: userAndCampaignParticipationId.id,
      state: 'completed',
      type: 'CAMPAIGN',
    });
  }
  const chunkSize = _getChunkSize(assessmentData[0]);
  return trx.batchInsert('assessments', assessmentData.flat(), chunkSize).returning(['id', 'userId']);
}

async function _createCampaignParticipations({
  campaignId,
  userIds,
  trx
}: $TSFixMe) {
  const participationData = [];
  for (const userId of userIds) {
    const createdAt = moment(baseDate).add(_.random(0, 100), 'days').toDate();
    const isShared = Boolean(_.random(0, 1));
    const sharedAt = isShared ? moment(createdAt).add(_.random(1, 10), 'days').toDate() : null;

    participationData.push({
      campaignId,
      createdAt,
      status: isShared ? SHARED : TO_SHARE,
      sharedAt,
      userId,
    });
  }
  const chunkSize = _getChunkSize(participationData[0]);
  return trx.batchInsert('campaign-participations', participationData.flat(), chunkSize).returning(['id', 'userId']);
}

async function _createAnswersAndKnowledgeElements({
  targetProfile,
  userAndAssessmentIds,
  trx
}: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tCréation des answers de référence...');
  const answerData = [];
  for (const userAndAssessmentId of userAndAssessmentIds) {
    answerData.push({
      value: 'someValue',
      assessmentId: userAndAssessmentId.id,
      challengeId: 'someChallengeId',
    });
  }
  const chunkSize = _getChunkSize(answerData[0]);
  const answerRecordedData = await trx
    .batchInsert('answers', answerData.flat(), chunkSize)
    .returning(['id', 'assessmentId']);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tOK');

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tCréation des knowledge-elements...');
  const knowledgeElementData = [];
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\t\tCréation des données par acquis...');
  for (const skill of targetProfile.skills) {
    const knowledgeElementDataForOneSkill = [];
    for (const userAndAssessmentId of userAndAssessmentIds) {
      const status = Math.random() < 0.7 ? 'validated' : 'invalidated';
      const referenceAnswer = answerRecordedData.find((answerRecordedItem: $TSFixMe) => {
        return answerRecordedItem.assessmentId === userAndAssessmentId.id;
      });
      const knowledgeElementProps = {
        source: 'direct',
        status,
        assessmentId: referenceAnswer.assessmentId,
        skillId: skill.id,
        earnedPix: status === 'validated' ? skill.pixValue : 0,
        userId: userAndAssessmentIds.find(
          (userAndAssessmentId: $TSFixMe) => userAndAssessmentId.id === referenceAnswer.assessmentId
        ).userId,
        competenceId: skill.competenceId,
        answerId: referenceAnswer.id,
      };
      knowledgeElementDataForOneSkill.push({
        ...knowledgeElementProps,
        createdAt: firstKECreatedAt,
      });
      knowledgeElementDataForOneSkill.push({
        ...knowledgeElementProps,
        createdAt: secondKECreatedAt,
      });
    }
    knowledgeElementData.push(knowledgeElementDataForOneSkill);
    _logProgression(targetProfile.skills.length);
  }
  _resetProgression();
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\t\tOK');

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\t\tInsertion en base de données...');
  const chunkedKnowledgeElements = _.chunk(knowledgeElementData.flat(), _getChunkSize(knowledgeElementData[0][0]));
  let totalKeCount = 0;
  for (const chunk of chunkedKnowledgeElements) {
    await trx('knowledge-elements').insert(chunk);
    totalKeCount = totalKeCount + chunk.length;
    _logProgression(chunkedKnowledgeElements.length);
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\t\tOK');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\t${totalKeCount} knowledge-elements créés`);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tOK');
}

async function _createBadgeAcquisitions({
  targetProfile,
  userAndCampaignParticipationIds,
  trx
}: $TSFixMe) {
  const badges = await trx.select('id').from('badges').where({ targetProfileId: targetProfile.id });
  const badgeIds = _.map(badges, 'id');
  if (badgeIds.length === 0) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`\tAucun badge pour le profil cible ${targetProfile.id} - ${targetProfile.name}`);
    return;
  }
  const badgeAcquisitionData = [];
  for (const userAndCampaignParticipationId of userAndCampaignParticipationIds) {
    for (const badgeId of badgeIds) {
      const haveBadge = _.random(0, 1) === 1;
      if (haveBadge) {
        badgeAcquisitionData.push({
          userId: userAndCampaignParticipationId.userId,
          badgeId,
        });
      }
    }
  }
  const chunkSize = _getChunkSize(badgeAcquisitionData[0]);
  await trx.batchInsert('badge-acquisitions', badgeAcquisitionData.flat(), chunkSize);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\t${badgeAcquisitionData.flat().length} acquisitions de badge créées`);
}

async function _createParticipants({
  count,
  targetProfile,
  organizationId,
  campaignId,
  trx
}: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Création des utilisateurs...');
  const userIds = await _createUsers({ count, uniqId: targetProfile.id, trx });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
  if (createOrganizationLearner) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Création des organization-learners...');
    await _createOrganizationLearners({ userIds, organizationId, uniqId: targetProfile.id, trx });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('OK');
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Création des campaign-participations...');
  const userAndCampaignParticipationIds = await _createCampaignParticipations({ campaignId, userIds, trx });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Création des assessments...');
  const userAndAssessmentIds = await _createAssessments({ userAndCampaignParticipationIds, trx });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Création des answers/knowledge-elements...');
  await _createAnswersAndKnowledgeElements({ targetProfile, userAndAssessmentIds, trx });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Création des obtentions de badge...');
  await _createBadgeAcquisitions({ targetProfile, userAndCampaignParticipationIds, trx });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
}

async function _do({
  organizationId,
  targetProfileId,
  participantCount,
  profileType,
  campaignType
}: $TSFixMe) {
  const targetProfile = targetProfileId
    ? await _getTargetProfile(targetProfileId)
    : await _createTargetProfile({ profileType });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Création de la campagne...');
  const campaignId = await _createCampaign({ organizationId, campaignType, targetProfileId: targetProfile.id });
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('OK');
  const trx = await knex.transaction();
  if (lowRAMMode) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("Mode lowRAM activé. Découpage de l'opération en plusieurs paquets de 150 participants.");
    let participantLeftToProcess = participantCount;
    const PARTICIPANT_CHUNK_SIZE = 500;
    while (participantLeftToProcess > 0) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(`Reste à traiter : ${participantLeftToProcess} participants`);
      participantLeftToProcess = participantLeftToProcess - PARTICIPANT_CHUNK_SIZE;
      await _createParticipants({ count: PARTICIPANT_CHUNK_SIZE, targetProfile, organizationId, campaignId, trx });
    }
  } else {
    await _createParticipants({ count: participantCount, targetProfile, organizationId, campaignId, trx });
  }
  await trx.commit();
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('génération des snapshots KE ...');
  const campaignParticipationData = await getEligibleCampaignParticipations(participantCount);
  await generateKnowledgeElementSnapshots(campaignParticipationData, 3);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('pré-calcul des résultats ...');
  await computeParticipationResults();
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(
    `Campagne: ${campaignId}\nOrganisation: ${organizationId}\nNombre de participants: ${participantCount}\nProfil Cible: ${targetProfile.id}`
  );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const commandLineArgs = process.argv.slice(2);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Validation des arguments...');
    // @ts-expect-error TS(2339): Property 'organizationId' does not exist on type '... Remove this comment to see the full error message
    const { organizationId, targetProfileId, participantCount, profileType, campaignType } =
      _validateAndNormalizeArgs(commandLineArgs);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('OK');
    await _do({
      organizationId,
      targetProfileId,
      participantCount,
      profileType,
      campaignType,
    });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('FIN');
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(error);
    _printUsage();
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
