// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCampaign = require('../orm-models/Campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isCodeAvailable(code: $TSFixMe) {
    return BookshelfCampaign.where({ code })
      .fetch({ require: false })
      .then((campaign: $TSFixMe) => {
        if (campaign) {
          return false;
        }
        return true;
      });
  },

  async getByCode(code: $TSFixMe) {
    const bookshelfCampaign = await BookshelfCampaign.where({ code }).fetch({
      require: false,
      withRelated: ['organization'],
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaign, bookshelfCampaign);
  },

  async get(id: $TSFixMe) {
    const bookshelfCampaign = await BookshelfCampaign.where({ id })
      .fetch({
        withRelated: ['creator', 'organization', 'targetProfile'],
      })
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfCampaign.NotFoundError) {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
          throw new NotFoundError(`Not found campaign for ID ${id}`);
        }
        throw err;
      });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaign, bookshelfCampaign);
  },

  async save(campaign: $TSFixMe) {
    const campaignAttributes = _.pick(campaign, [
      'name',
      'code',
      'title',
      'type',
      'idPixLabel',
      'customLandingPageText',
      'creatorId',
      'ownerId',
      'organizationId',
      'targetProfileId',
      'multipleSendings',
    ]);

    const createdCampaign = await new BookshelfCampaign(campaignAttributes).save();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaign, createdCampaign);
  },

  async update(campaign: $TSFixMe) {
    const editedAttributes = _.pick(campaign, ['name', 'title', 'customLandingPageText', 'archivedAt', 'ownerId']);
    const bookshelfCampaign = await BookshelfCampaign.where({ id: campaign.id }).fetch();
    await bookshelfCampaign.save(editedAttributes, { method: 'update', patch: true });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaign, bookshelfCampaign);
  },

  async checkIfUserOrganizationHasAccessToCampaign(campaignId: $TSFixMe, userId: $TSFixMe) {
    try {
      await BookshelfCampaign.query((qb: $TSFixMe) => {
        qb.where({ 'campaigns.id': campaignId, 'memberships.userId': userId, 'memberships.disabledAt': null });
        qb.innerJoin('memberships', 'memberships.organizationId', 'campaigns.organizationId');
        qb.innerJoin('organizations', 'organizations.id', 'campaigns.organizationId');
      }).fetch();
    } catch (e) {
      return false;
    }
    return true;
  },

  async checkIfCampaignIsArchived(campaignId: $TSFixMe) {
    const bookshelfCampaign = await BookshelfCampaign.where({ id: campaignId }).fetch();

    const campaign = bookshelfToDomainConverter.buildDomainObject(BookshelfCampaign, bookshelfCampaign);
    return campaign.isArchived();
  },

  async getCampaignTitleByCampaignParticipationId(campaignParticipationId: $TSFixMe) {
    const campaign = await knex('campaigns')
      .select('title')
      .join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
      .where({ 'campaign-participations.id': campaignParticipationId })
      .first();

    if (!campaign) return null;
    return campaign.title;
  },

  async getCampaignCodeByCampaignParticipationId(campaignParticipationId: $TSFixMe) {
    const campaign = await knex('campaigns')
      .select('code')
      .join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
      .where({ 'campaign-participations.id': campaignParticipationId })
      .first();

    if (!campaign) return null;
    return campaign.code;
  },

  async getCampaignIdByCampaignParticipationId(campaignParticipationId: $TSFixMe) {
    const campaign = await knex('campaigns')
      .select('campaigns.id')
      .join('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
      .where({ 'campaign-participations.id': campaignParticipationId })
      .first();

    if (!campaign) return null;
    return campaign.id;
  },
};
