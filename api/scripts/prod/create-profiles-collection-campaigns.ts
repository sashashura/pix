// Usage: node create-profile-collection-campaigns.js path/file.csv <creatorId>
// To use on file with columns |name, organizationId, customLandingPageText, creatorId|, those headers included
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
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
function checkData(campaignData: $TSFixMe) {
  return campaignData.map(({
    name,
    organizationId,
    customLandingPageText,
    creatorId
  }: $TSFixMe, index: $TSFixMe) => {
    if (!organizationId) {
      throw new Error(`Ligne ${index + 1}: L'organizationId est obligatoire pour la campagne de collecte de profils.`);
    }
    if (!name) {
      throw new Error(
        `Ligne ${index + 1}: Le nom de campagne est obligatoire pour la campagne de collecte de profils.`
      );
    }
    if (!creatorId) {
      throw new Error(`Ligne ${index + 1}: Le creatorId est obligatoire pour la campagne de collecte de profils.`);
    }

    return { name, organizationId, customLandingPageText, creatorId };
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareCam... Remove this comment to see the full error message
async function prepareCampaigns(campaignsData: $TSFixMe) {
  const generatedList: $TSFixMe = [];
  const campaigns = await bluebird.map(
    campaignsData,
    async (campaignData: $TSFixMe) => {
      const campaign = {
        creatorId: campaignData.creatorId,
        organizationId: campaignData.organizationId,
        type: CampaignTypes.PROFILES_COLLECTION,
        name: campaignData.name,
        customLandingPageText: campaignData.customLandingPageText,
        multipleSendings: campaignData.multipleSendings,
      };

      campaignValidator.validate(campaign);
      (campaign as $TSFixMe).code = await campaignCodeGenerator.generate(campaignRepository, generatedList);
      generatedList.push((campaign as $TSFixMe).code);

      // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
      if (require.main === module)
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.stdout.write(
          `Campagne de collecte de profils ${campaign.name} pour l'organisation ${campaign.organizationId} ===> ✔\n`
        );
      return campaign;
    },
    { concurrency: 10 }
  );

  return campaigns.flat();
}

function createProfilesCollectionCampaigns(campaigns: $TSFixMe) {
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
    await createProfilesCollectionCampaigns(campaigns);

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
};
