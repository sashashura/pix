const { knex } = require('../../../db/knex-database-connection');
const DomainTransaction = require('../DomainTransaction');
const ComplementaryCertificationCourseResultBookshelf = require('../orm-models/ComplementaryCertificationCourseResult');
const CleaCertificationScoring = require('../../domain/models/CleaCertificationScoring');
const Badge = require('../../domain/models/Badge');
const ComplementaryCertificationCourseResult = require('../../domain/models/ComplementaryCertificationCourseResult');
const ComplementaryCertification = require('../../domain/models/ComplementaryCertification');
const _ = require('lodash');

module.exports = {
  async getCleaCertificationScoring({
    complementaryCertificationCourseId,
    certificationCourseId,
    userId,
    reproducibilityRate,
    domainTransaction = DomainTransaction.emptyTransaction(),
  }) {
    const cleaBadgeKey = await _getAcquiredCleaBadgeKey(userId, certificationCourseId, domainTransaction);
    const hasAcquiredBadge = Boolean(cleaBadgeKey);
    if (!hasAcquiredBadge) {
      return CleaCertificationScoring.buildNotEligible({ complementaryCertificationCourseId });
    }
    const pixScore = await _getLatestPixScoreByCertificationCourseId(certificationCourseId);
    const { minimumEarnedPix, minimumReproducibilityRate } = await _getMinimumReproducibilityRateAndMinimumEarnedPix();

    return new CleaCertificationScoring({
      complementaryCertificationCourseId,
      hasAcquiredBadge,
      reproducibilityRate,
      cleaBadgeKey,
      pixScore,
      minimumEarnedPix,
      minimumReproducibilityRate,
    });
  },

  async save({ partnerCertificationScoring, domainTransaction = DomainTransaction.emptyTransaction() }) {
    const partnerCertificationToSave = new ComplementaryCertificationCourseResultBookshelf(
      _adaptModelToDB({
        ...partnerCertificationScoring,
        source: ComplementaryCertificationCourseResult.sources.PIX,
        complementaryCertificationCourseId: partnerCertificationScoring.complementaryCertificationCourseId,
        acquired: partnerCertificationScoring.isAcquired(),
      })
    );

    const complementaryCertificationCourseResult = await knex
      .select('id')
      .from('complementary-certification-course-results')
      .where({
        complementaryCertificationCourseId: partnerCertificationScoring.complementaryCertificationCourseId,
        partnerKey: partnerCertificationScoring.partnerKey,
        source: partnerCertificationScoring.source,
      })
      .first();

    if (complementaryCertificationCourseResult) {
      return partnerCertificationToSave
        .query(function (qb) {
          qb.where({
            id: complementaryCertificationCourseResult.id,
          });
        })
        .save(null, { transacting: domainTransaction.knexTransaction, method: 'update' });
    }

    return partnerCertificationToSave.save(null, { transacting: domainTransaction.knexTransaction, method: 'insert' });
  },
};

function _adaptModelToDB({ complementaryCertificationCourseId, partnerKey, source, acquired }) {
  return { complementaryCertificationCourseId, partnerKey, source, acquired };
}

async function _getAcquiredCleaBadgeKey(userId, certificationCourseId, domainTransaction) {
  const badgeAcquisitionQuery = knex('badge-acquisitions')
    .pluck('badges.key')
    .innerJoin('badges', 'badges.id', 'badgeId')
    .innerJoin('certification-courses', 'certification-courses.userId', 'badge-acquisitions.userId')
    .where('badge-acquisitions.userId', userId)
    .whereIn('badges.key', [
      Badge.keys.PIX_EMPLOI_CLEA_V1,
      Badge.keys.PIX_EMPLOI_CLEA_V2,
      Badge.keys.PIX_EMPLOI_CLEA_V3,
    ])
    .where('certification-courses.id', certificationCourseId)
    .where('badge-acquisitions.createdAt', '<', knex.ref('certification-courses.createdAt'))
    .orderBy('badge-acquisitions.createdAt', 'DESC');
  if (domainTransaction.knexTransaction) {
    badgeAcquisitionQuery.transacting(domainTransaction.knexTransaction);
  }
  const [acquiredBadgeKey] = await badgeAcquisitionQuery;
  return acquiredBadgeKey;
}

async function _getLatestPixScoreByCertificationCourseId(certificationCourseId) {
  const { pixScore } = await knex
    .select('assessment-results.pixScore')
    .from('assessments')
    .innerJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .where({ 'assessments.certificationCourseId': certificationCourseId })
    .orderBy('assessment-results.createdAt', 'DESC')
    .first();

  return pixScore;
}

async function _getMinimumReproducibilityRateAndMinimumEarnedPix() {
  const { minimumReproducibilityRate, minimumEarnedPix } = await knex('complementary-certifications')
    .select('minimumReproducibilityRate', 'minimumEarnedPix')
    .where({ key: ComplementaryCertification.CLEA })
    .first();

  return {
    minimumEarnedPix,
    minimumReproducibilityRate: _.toNumber(minimumReproducibilityRate),
  };
}
