// Usage: node create-assessment-campaigns.js path/file.csv
// To use on file with columns |targetProfileId, name, externalId, title, customLandingPageText, creatorId|, those headers included
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignCodeGenerator = require('../../lib/domain/services/campaigns/campaign-code-generator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignVa... Remove this comment to see the full error message
const campaignValidator = require('../../lib/domain/validators/campaign-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignRepository = require('../../lib/infrastructure/repositories/campaign-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('../helpers/csvHelpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkData'... Remove this comment to see the full error message
function checkData(csvData: $TSFixMe) {
  return csvData.map(({
    targetProfileId,
    name,
    externalId,
    title,
    customLandingPageText,
    creatorId
  }: $TSFixMe) => {
    if (!targetProfileId) {
      throw new Error(`Un targetProfileId est manquant pour la campagne ${name}.`);
    }
    if (!name) {
      throw new Error(`Un nom de campagne est manquant pour le profil cible ${targetProfileId}.`);
    }
    if (!externalId) {
      throw new Error(`Un externalId est manquant pour le profil cible ${targetProfileId}.`);
    }
    if (!creatorId) {
      throw new Error(`Un creatorId est manquant pour le profil cible ${targetProfileId}.`);
    }
    if (_.isEmpty(title)) title = null;
    if (_.isEmpty(customLandingPageText)) customLandingPageText = null;

    return { targetProfileId, name, externalId, title, customLandingPageText, creatorId };
  });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function prepareCampaigns(campaignsData: $TSFixMe) {
  const campaigns = await bluebird.mapSeries(campaignsData, async (campaignData: $TSFixMe) => {
    const organization = await getByExternalIdFetchingIdOnly(campaignData.externalId);

    const campaign = {
      creatorId: campaignData.creatorId,
      organizationId: organization.id,
      type: CampaignTypes.ASSESSMENT,
      targetProfileId: campaignData.targetProfileId,
      name: campaignData.name,
      title: campaignData.title,
      customLandingPageText: campaignData.customLandingPageText,
      multipleSendings: campaignData.multipleSendings,
    };

    campaignValidator.validate(campaign);
    (campaign as $TSFixMe).code = await campaignCodeGenerator.generate(campaignRepository);
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    if (require.main === module)
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.stdout.write(`Campagne ${campaign.name} pour l'organisation ${campaign.organizationId} ===> ✔\n`);
    return campaign;
  });

  return campaigns.flat();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getByExter... Remove this comment to see the full error message
async function getByExternalIdFetchingIdOnly(externalId: $TSFixMe) {
  const organization = await knex('organizations')
    .select('id', 'externalId')
    .whereRaw('LOWER (??) = ?', ['externalId', externalId.toLowerCase()])
    .first();

  if (!organization) {
    throw new Error(`L'organisation d'UAI ${externalId} n'existe pas.`);
  }

  return organization;
}

function createAssessmentCampaignsForSco(campaigns: $TSFixMe) {
  return knex.batchInsert('campaigns', campaigns);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const filePath = process.argv[2];

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Lecture et parsing du fichier csv... ');
    const csvData = await parseCsvWithHeader(filePath);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Vérification des données du fichier csv...');
    const checkedData = checkData(csvData);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Création des modèles campagne...');
    const campaigns = await prepareCampaigns(checkedData);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Création des campagnes...');
    await createAssessmentCampaignsForSco(campaigns);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('FIN');
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\x1b[31mErreur : %s\x1b[0m', (error as $TSFixMe).message);
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

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  prepareCampaigns,
  checkData,
  getByExternalIdFetchingIdOnly,
};
