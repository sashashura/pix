const _ = require('lodash');
const { knex } = require('../bookshelf');
const JuryCertificationSummary = require('../../domain/read-models/JuryCertificationSummary');

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

module.exports = {

  async findPaginatedFilteredBySessionId({ sessionId, filter, page }) {
    const pageSize = page.size ? page.size : DEFAULT_PAGE_SIZE;
    const pageNumber = page.number ? page.number : DEFAULT_PAGE_NUMBER;
    const offset = (pageNumber - 1) * pageSize;
    const query = knex.from('certifications_every_assess_results');

    _setupFilters(query, filter);
    const results = await query.with('certifications_every_assess_results', (qb) => {
      qb.select('certification-courses.*', 'assessment-results.pixScore', 'assessment-results.status')
        .select(knex.raw('ROW_NUMBER() OVER (PARTITION BY ?? ORDER BY ?? DESC) AS asr_row_number',
          ['certification-courses.id', 'assessment-results.createdAt']))
        .from('certification-courses')
        .leftJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
        .leftJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
        .where('certification-courses.sessionId', sessionId);
    })
      .select('*')
      .select(knex.raw('COUNT(*) OVER() AS ??', ['rowCount']))
      .where('asr_row_number', 1)
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .limit(pageSize).offset(offset);

    let rowCount = 0;

    const juryCertificationSummaries = _.map(results, (result) => {
      rowCount = result.rowCount;
      return _toDomain(result);
    });

    return {
      juryCertificationSummaries,
      pagination: {
        page: pageNumber,
        pageSize,
        rowCount,
        pageCount: Math.ceil(rowCount / pageSize),
      },
    };
  }
};

function _toDomain(juryCertificationSummaryFromDB) {
  return new JuryCertificationSummary({
    ...juryCertificationSummaryFromDB,
  });
}

function _setupFilters(query, filters) {
  const { id, firstName, lastName, pixScore, status } = filters;

  if (id) {
    query.whereRaw('CAST(id as TEXT) LIKE ?', `%${id.toString().toLowerCase()}%`);
  }
  if (firstName) {
    query.whereRaw('LOWER("firstName") LIKE ?', `%${firstName.toLowerCase()}%`);
  }
  if (lastName) {
    query.whereRaw('LOWER("lastName") LIKE ?', `%${lastName.toLowerCase()}%`);
  }
  if (pixScore) {
    query.whereRaw('CAST("pixScore" as TEXT) LIKE ?', `%${pixScore.toString().toLowerCase()}%`);
  }
  if (status) {
    query.where('status', status.toLowerCase());
  }
}

