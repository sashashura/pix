// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScoOrganiz... Remove this comment to see the full error message
const ScoOrganizationParticipant = require('../../domain/read-models/ScoOrganizationParticipant');

// @ts-expect-error TS(2393): Duplicate function implementation.
function _setFilters(qb: $TSFixMe, {
  lastName,
  firstName,
  divisions,
  connexionType
}: $TSFixMe = {}) {
  if (lastName) {
    qb.whereRaw('LOWER("organization-learners"."lastName") LIKE ?', `%${lastName.toLowerCase()}%`);
  }
  if (firstName) {
    qb.whereRaw('LOWER("organization-learners"."firstName") LIKE ?', `%${firstName.toLowerCase()}%`);
  }
  if (!_.isEmpty(divisions)) {
    qb.whereIn('division', divisions);
  }
  if (connexionType === 'none') {
    qb.whereRaw('"users"."username" IS NULL');
    qb.whereRaw('"users"."email" IS NULL');
    // we only retrieve GAR authentication method in join clause
    qb.whereRaw('"authentication-methods"."externalIdentifier" IS NULL');
  } else if (connexionType === 'identifiant') {
    qb.whereRaw('"users"."username" IS NOT NULL');
  } else if (connexionType === 'email') {
    qb.whereRaw('"users"."email" IS NOT NULL');
  } else if (connexionType === 'mediacentre') {
    // we only retrieve GAR authentication method in join clause
    qb.whereRaw('"authentication-methods"."externalIdentifier" IS NOT NULL');
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findPaginatedFilteredScoParticipants({
    organizationId,
    filter,
    page = {}
  }: $TSFixMe) {
    const query = knex
      .distinct('organization-learners.id')
      .select([
        'organization-learners.id',
        'organization-learners.firstName',
        'organization-learners.lastName',
        knex.raw('LOWER("organization-learners"."firstName") AS "lowerFirstName"'),
        knex.raw('LOWER("organization-learners"."lastName") AS "lowerLastName"'),
        'organization-learners.birthdate',
        'organization-learners.division',
        'organization-learners.userId',
        'organization-learners.organizationId',
        'users.username',
        'users.email',
        'authentication-methods.externalIdentifier as samlId',
        knex.raw(
          'FIRST_VALUE("name") OVER(PARTITION BY "organizationLearnerId" ORDER BY "campaign-participations"."createdAt" DESC) AS "campaignName"'
        ),
        knex.raw(
          'FIRST_VALUE("campaign-participations"."status") OVER(PARTITION BY "organizationLearnerId" ORDER BY "campaign-participations"."createdAt" DESC) AS "participationStatus"'
        ),
        knex.raw(
          'FIRST_VALUE("type") OVER(PARTITION BY "organizationLearnerId" ORDER BY "campaign-participations"."createdAt" DESC) AS "campaignType"'
        ),
        knex.raw(
          'COUNT(*) FILTER (WHERE "campaign-participations"."id" IS NOT NULL) OVER(PARTITION BY "organizationLearnerId") AS "participationCount"'
        ),
        knex.raw(
          'max("campaign-participations"."createdAt") OVER(PARTITION BY "organizationLearnerId") AS "lastParticipationDate"'
        ),
      ])
      .from('organization-learners')
      .leftJoin('campaign-participations', 'campaign-participations.organizationLearnerId', 'organization-learners.id')
      .leftJoin('users', 'users.id', 'organization-learners.userId')
      .leftJoin('authentication-methods', function(this: $TSFixMe) {
        this.on('users.id', 'authentication-methods.userId').andOnVal(
          'authentication-methods.identityProvider',
          AuthenticationMethod.identityProviders.GAR
        );
      })
      .leftJoin('campaigns', function(this: $TSFixMe) {
        this.on('campaigns.id', 'campaign-participations.campaignId').andOn(
          'campaigns.organizationId',
          'organization-learners.organizationId'
        );
      })
      .where(function (qb: $TSFixMe) {
        qb.where({ 'campaign-participations.id': null });
        qb.orWhere({
          'campaign-participations.isImproved': false,
          'campaign-participations.deletedAt': null,
        });
      })
      .where('organization-learners.isDisabled', false)
      .where('organization-learners.organizationId', organizationId)
      .modify(_setFilters, filter)
      .orderByRaw('?? ASC, ?? ASC', ['lowerLastName', 'lowerFirstName']);

    const { results, pagination } = await fetchPage(query, page);

    const scoOrganizationParticipants = results.map((result: $TSFixMe) => {
      return new ScoOrganizationParticipant({
        ...result,
        isAuthenticatedFromGAR: !!result.samlId,
      });
    });
    return {
      data: scoOrganizationParticipants,
      pagination,
    };
  },
};
