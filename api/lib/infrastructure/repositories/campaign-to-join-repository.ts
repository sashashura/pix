// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
const CampaignToJoin = require('../../domain/read-models/CampaignToJoin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const result = await knexConn('campaigns')
      .select('campaigns.*')
      .select({
        organizationId: 'organizations.id',
        organizationName: 'organizations.name',
        organizationType: 'organizations.type',
        organizationLogoUrl: 'organizations.logoUrl',
        organizationIsManagingStudents: 'organizations.isManagingStudents',
        organizationShowNPS: 'organizations.showNPS',
        organizationFormNPSUrl: 'organizations.formNPSUrl',
        targetProfileName: 'target-profiles.name',
        targetProfileImageUrl: 'target-profiles.imageUrl',
      })
      .join('organizations', 'organizations.id', 'campaigns.organizationId')
      .leftJoin('target-profiles', 'target-profiles.id', 'campaigns.targetProfileId')
      .where('campaigns.id', id)
      .first();

    if (!result) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`La campagne d'id ${id} n'existe pas ou son accès est restreint`);
    }

    return new CampaignToJoin(result);
  },

  async getByCode(code: $TSFixMe) {
    const result = await knex('campaigns')
      .select('campaigns.*')
      .select({
        organizationId: 'organizations.id',
        organizationName: 'organizations.name',
        organizationType: 'organizations.type',
        organizationLogoUrl: 'organizations.logoUrl',
        organizationIsManagingStudents: 'organizations.isManagingStudents',
        organizationShowNPS: 'organizations.showNPS',
        organizationFormNPSUrl: 'organizations.formNPSUrl',
        targetProfileName: 'target-profiles.name',
        targetProfileImageUrl: 'target-profiles.imageUrl',
        targetProfileIsSimplifiedAccess: 'target-profiles.isSimplifiedAccess',
        identityProvider: 'organizations.identityProviderForCampaigns',
      })
      .join('organizations', 'organizations.id', 'campaigns.organizationId')
      .leftJoin('target-profiles', 'target-profiles.id', 'campaigns.targetProfileId')
      .where('campaigns.code', code)
      .first();

    if (!result) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`La campagne au code ${code} n'existe pas ou son accès est restreint`);
    }

    return new CampaignToJoin(result);
  },
};
