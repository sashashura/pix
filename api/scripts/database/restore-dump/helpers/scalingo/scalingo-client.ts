// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const scalingo = require('scalingo');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScalingoDB... Remove this comment to see the full error message
const ScalingoDBClient = require('./db-client');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScalingoCl... Remove this comment to see the full error message
class ScalingoClient {
  application: $TSFixMe;
  client: $TSFixMe;
  region: $TSFixMe;
  constructor({
    client,
    application,
    region
  }: $TSFixMe) {
    this.application = application;
    this.client = client;
    this.region = region;
  }

  static async getInstance({
    application,
    token,
    region
  }: $TSFixMe) {
    const apiUrl = `https://api.${region}.scalingo.com`;
    const client = await scalingo.clientFromToken(token, { apiUrl });

    return new ScalingoClient({ client, application, region });
  }

  async getAddon(addonProviderId: $TSFixMe) {
    try {
      const addons = await this.client.Addons.for(this.application);
      return addons.find((addon: $TSFixMe) => addon.addon_provider.id === addonProviderId);
    } catch (error) {
      throw new Error(`Unable to get the addon "${addonProviderId}" from Scalingo API. Response was ${(error as $TSFixMe).message}`);
    }
  }

  async getAddonApiToken(addonId: $TSFixMe) {
    try {
      const response = await this.client.apiClient().post(`/apps/${this.application}/addons/${addonId}/token`);
      return response.data.addon.token;
    } catch (error) {
      throw new Error(`Unable to get the addon token from Scalingo API. Response was ${(error as $TSFixMe).message}`);
    }
  }

  async getDatabaseClient(dbId: $TSFixMe) {
    const dbToken = await this.getAddonApiToken(dbId);
    return ScalingoDBClient.getInstance({ dbId, dbToken, region: this.region });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ScalingoClient;
