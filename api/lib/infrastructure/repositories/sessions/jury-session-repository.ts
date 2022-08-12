// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JurySessio... Remove this comment to see the full error message
const JurySession = require('../../../domain/models/JurySession');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const { statuses } = require('../../../domain/models/JurySession');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationOfficer = require('../../../domain/models/CertificationOfficer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_UNIQ... Remove this comment to see the full error message
const { PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR } = require('../../../../db/pgsql-errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMNS'.
const COLUMNS = Object.freeze([
  'sessions.*',
  'certification-centers.type',
  'certification-centers.externalId',
  'users.firstName',
  'users.lastName',
]);
const ALIASED_COLUMNS = Object.freeze({
  juryCommentAuthorFirstName: 'jury-comment-authors.firstName',
  juryCommentAuthorLastName: 'jury-comment-authors.lastName',
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    const jurySessionDTO = await knex
      .select(COLUMNS)
      .select(ALIASED_COLUMNS)
      .from('sessions')
      .leftJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
      .leftJoin('users', 'users.id', 'sessions.assignedCertificationOfficerId')
      .leftJoin({ 'jury-comment-authors': 'users' }, 'jury-comment-authors.id', 'sessions.juryCommentAuthorId')
      .where('sessions.id', '=', id)
      .first();
    if (!jurySessionDTO) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError("La session n'existe pas ou son accès est restreint");
    }
    return _toDomain(jurySessionDTO);
  },

  async findPaginatedFiltered({
    filters,
    page
  }: $TSFixMe) {
    const query = knex
      .select(COLUMNS)
      .select(ALIASED_COLUMNS)
      .from('sessions')
      .leftJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
      .leftJoin('users', 'users.id', 'sessions.assignedCertificationOfficerId')
      .leftJoin({ 'jury-comment-authors': 'users' }, 'jury-comment-authors.id', 'sessions.juryCommentAuthorId')
      .modify(_setupFilters, filters)
      .orderByRaw('?? ASC NULLS FIRST', 'publishedAt')
      .orderByRaw('?? ASC', 'finalizedAt')
      .orderBy('id');

    const { results, pagination } = await fetchPage(query, page);
    const jurySessions = results.map(_toDomain);

    return {
      jurySessions,
      pagination,
    };
  },

  async assignCertificationOfficer({
    id,
    assignedCertificationOfficerId
  }: $TSFixMe) {
    try {
      await knex('sessions').where({ id }).update({ assignedCertificationOfficerId }).returning('*');
      return this.get(id);
    } catch (error) {
      if ((error as $TSFixMe).code === PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError(`L'utilisateur d'id ${assignedCertificationOfficerId} n'existe pas`);
      }
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`La session d'id ${id} n'existe pas.`);
    }
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(jurySessionFromDB: $TSFixMe) {
  let assignedCertificationOfficer = null;
  if (jurySessionFromDB.assignedCertificationOfficerId) {
    assignedCertificationOfficer = new CertificationOfficer({
      id: jurySessionFromDB.assignedCertificationOfficerId,
      firstName: jurySessionFromDB.firstName,
      lastName: jurySessionFromDB.lastName,
    });
  }

  let juryCommentAuthor = null;
  if (jurySessionFromDB.juryCommentAuthorId) {
    juryCommentAuthor = new CertificationOfficer({
      id: jurySessionFromDB.juryCommentAuthorId,
      firstName: jurySessionFromDB.juryCommentAuthorFirstName,
      lastName: jurySessionFromDB.juryCommentAuthorLastName,
    });
  }

  const jurySession = new JurySession({
    ...jurySessionFromDB,
    certificationCenterName: jurySessionFromDB.certificationCenter,
    certificationCenterType: jurySessionFromDB.type,
    certificationCenterExternalId: jurySessionFromDB.externalId,
    assignedCertificationOfficer,
    juryCommentAuthor,
  });

  return jurySession;
}

function _setupFilters(query: $TSFixMe, filters: $TSFixMe) {
  const {
    id,
    certificationCenterName,
    status,
    resultsSentToPrescriberAt,
    certificationCenterExternalId,
    certificationCenterType,
  } = filters;

  if (id) {
    query.where('sessions.id', id);
  }

  if (certificationCenterName) {
    query.whereRaw('LOWER(??) LIKE ?', ['certificationCenter', '%' + certificationCenterName.toLowerCase() + '%']);
  }

  if (certificationCenterType) {
    query.where('certification-centers.type', certificationCenterType);
  }

  if (certificationCenterExternalId) {
    query.whereRaw('LOWER(??) LIKE ?', [
      'certification-centers.externalId',
      '%' + certificationCenterExternalId.toLowerCase() + '%',
    ]);
  }

  if (resultsSentToPrescriberAt === true) {
    query.whereNotNull('resultsSentToPrescriberAt');
  }
  if (resultsSentToPrescriberAt === false) {
    query.whereNull('resultsSentToPrescriberAt');
  }
  if (status === (statuses as $TSFixMe).CREATED) {
    query.whereNull('finalizedAt');
    query.whereNull('publishedAt');
  }
  if (status === (statuses as $TSFixMe).FINALIZED) {
    query.whereNotNull('finalizedAt');
    query.whereNull('assignedCertificationOfficerId');
    query.whereNull('publishedAt');
  }
  if (status === (statuses as $TSFixMe).IN_PROCESS) {
    query.whereNotNull('finalizedAt');
    query.whereNotNull('assignedCertificationOfficerId');
    query.whereNull('publishedAt');
  }
  if (status === (statuses as $TSFixMe).PROCESSED) {
    query.whereNotNull('publishedAt');
  }
}
