// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaService = require('../../domain/services/badge-criteria-service');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findStillValidBadgeAcquisitions({
    userId,
    domainTransaction
  }: $TSFixMe) {
    const highestCertifiableBadgeAcquisitions = await badgeAcquisitionRepository.findHighestCertifiable({
      userId,
      domainTransaction,
    });

    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId, domainTransaction });

    const badgeAcquisitions = await bluebird.mapSeries(
      highestCertifiableBadgeAcquisitions,
      async (badgeAcquisition: $TSFixMe) => {
        const badge = badgeAcquisition.badge;
        const targetProfile = await targetProfileRepository.get(badge.targetProfileId, domainTransaction);
        const isBadgeValid = badgeCriteriaService.areBadgeCriteriaFulfilled({
          knowledgeElements,
          targetProfile,
          badge,
        });
        return isBadgeValid ? badgeAcquisition : null;
      }
    );

    return _.compact(badgeAcquisitions);
  },
};
