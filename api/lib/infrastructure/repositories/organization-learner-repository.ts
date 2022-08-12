// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnerNotFound,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationLearnersCouldNotBeSavedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCouldN... Remove this comment to see the full error message
  UserCouldNotBeReconciledError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserWithOr... Remove this comment to see the full error message
const UserWithOrganizationLearner = require('../../domain/models/UserWithOrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../domain/models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerForAdmin = require('../../domain/read-models/OrganizationLearnerForAdmin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'studentRep... Remove this comment to see the full error message
const studentRepository = require('./student-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganizationLearner = require('../orm-models/OrganizationLearner');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');

function _setOrganizationLearnerFilters(
  qb: $TSFixMe,
  {
    lastName,
    firstName,
    studentNumber,
    divisions,
    groups,
    connexionType
  }: $TSFixMe = {}
) {
  if (lastName) {
    qb.whereRaw('LOWER("organization-learners"."lastName") LIKE ?', `%${lastName.toLowerCase()}%`);
  }
  if (firstName) {
    qb.whereRaw('LOWER("organization-learners"."firstName") LIKE ?', `%${firstName.toLowerCase()}%`);
  }
  if (studentNumber) {
    qb.whereRaw('LOWER("organization-learners"."studentNumber") LIKE ?', `%${studentNumber.toLowerCase()}%`);
  }
  if (!_.isEmpty(divisions)) {
    qb.whereIn('division', divisions);
  }
  if (groups) {
    qb.whereIn(
      knex.raw('LOWER("organization-learners"."group")'),
      groups.map((group: $TSFixMe) => group.toLowerCase())
    );
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

function _shouldStudentToImportBeReconciled(
  allOrganizationLearnersInSameOrganization: $TSFixMe,
  organizationLearner: $TSFixMe,
  studentToImport: $TSFixMe
) {
  const organizationLearnerWithSameUserId = allOrganizationLearnersInSameOrganization.find(
    (organizationLearnerInSameOrganization: $TSFixMe) => {
      return organizationLearnerInSameOrganization.userId === organizationLearner.account.userId;
    }
  );
  const isOrganizationLearnerReconciled = organizationLearnerWithSameUserId != null;
  const organizationLearnerHasSameUserIdAndNationalStudentId =
    organizationLearnerWithSameUserId?.nationalStudentId === organizationLearner.nationalStudentId;

  if (isOrganizationLearnerReconciled && !organizationLearnerHasSameUserIdAndNationalStudentId) {
    return false;
  }

  const isFromSameOrganization = studentToImport.organizationId === organizationLearner.account.organizationId;
  const isFromDifferentOrganizationWithSameBirthday =
    !isFromSameOrganization && studentToImport.birthdate === organizationLearner.account.birthdate;
  return isFromSameOrganization || isFromDifferentOrganizationWithSameBirthday;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByIds({
    ids
  }: $TSFixMe) {
    const organizationLearners = BookshelfOrganizationLearner.where('id', 'in', ids).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganizationLearner, organizationLearners);
  },

  findByOrganizationId({
    organizationId
  }: $TSFixMe, transaction = DomainTransaction.emptyTransaction()) {
    const knexConn = transaction.knexTransaction || knex;
    return knexConn('organization-learners')
      .where({ organizationId })
      .orderByRaw('LOWER("lastName") ASC, LOWER("firstName") ASC')
      .then((organizationLearners: $TSFixMe) => organizationLearners.map((organizationLearner: $TSFixMe) => new OrganizationLearner(organizationLearner))
      );
  },

  async findByOrganizationIdAndUpdatedAtOrderByDivision({
    organizationId,
    page,
    filter
  }: $TSFixMe) {
    const BEGINNING_OF_THE_2020_SCHOOL_YEAR = '2020-08-15';
    const query = BookshelfOrganizationLearner.where((qb: $TSFixMe) => {
      qb.where({ organizationId });
      qb.where('updatedAt', '>', BEGINNING_OF_THE_2020_SCHOOL_YEAR);
      qb.where('isDisabled', false);
    })
      .query((qb: $TSFixMe) => {
        qb.orderByRaw('LOWER("division") ASC, LOWER("lastName") ASC, LOWER("firstName") ASC');
        if (filter.divisions) {
          qb.whereIn('division', filter.divisions);
        }
      })
      .fetchPage({
        page: page.number,
        pageSize: page.size,
      });

    const { models, pagination } = await query;

    return {
      data: bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganizationLearner, models),
      pagination,
    };
  },

  async findByUserId({
    userId
  }: $TSFixMe) {
    const organizationLearners = await BookshelfOrganizationLearner.where({ userId }).orderBy('id').fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganizationLearner, organizationLearners);
  },

  async isOrganizationLearnerIdLinkedToUserAndSCOOrganization({
    userId,
    organizationLearnerId
  }: $TSFixMe) {
    const exist = await Bookshelf.knex('organization-learners')
      .select('organization-learners.id')
      .join('organizations', 'organization-learners.organizationId', 'organizations.id')
      .where({ userId, type: 'SCO', 'organization-learners.id': organizationLearnerId })
      .first();

    return Boolean(exist);
  },

  async disableAllOrganizationLearnersInOrganization({
    domainTransaction,
    organizationId
  }: $TSFixMe) {
    const knexConn = domainTransaction.knexTransaction;
    await knexConn('organization-learners')
      .where({ organizationId, isDisabled: false })
      .update({ isDisabled: true, updatedAt: knexConn.raw('CURRENT_TIMESTAMP') });
  },

  async addOrUpdateOrganizationOfOrganizationLearners(organizationLearnerDatas: $TSFixMe, organizationId: $TSFixMe, domainTransaction: $TSFixMe) {
    const knexConn = domainTransaction.knexTransaction;
    const organizationLearnersFromFile = organizationLearnerDatas.map(
      (organizationLearnerData: $TSFixMe) => new OrganizationLearner({
        ...organizationLearnerData,
        organizationId,
      })
    );
    const existingOrganizationLearners = await this.findByOrganizationId({ organizationId }, domainTransaction);

    const reconciledOrganizationLearnersToImport = await this._reconcileOrganizationLearners(
      organizationLearnersFromFile,
      existingOrganizationLearners,
      domainTransaction
    );

    try {
      const organizationLearnersToSave = reconciledOrganizationLearnersToImport.map((organizationLearner: $TSFixMe) => ({
        ..._.omit(organizationLearner, ['id', 'createdAt']),
        updatedAt: knexConn.raw('CURRENT_TIMESTAMP'),
        isDisabled: false
      }));
      await knexConn('organization-learners')
        .insert(organizationLearnersToSave)
        .onConflict(['organizationId', 'nationalStudentId'])
        .merge();
    } catch (err) {
      throw new OrganizationLearnersCouldNotBeSavedError();
    }
  },

  async _reconcileOrganizationLearners(studentsToImport: $TSFixMe, allOrganizationLearnersInSameOrganization: $TSFixMe, domainTransaction: $TSFixMe) {
    const nationalStudentIdsFromFile = studentsToImport
      .map((organizationLearnerData: $TSFixMe) => organizationLearnerData.nationalStudentId)
      .filter(Boolean);
    const organizationLearnersWithSameNationalStudentIdsAsImported =
      await studentRepository.findReconciledStudentsByNationalStudentId(nationalStudentIdsFromFile, domainTransaction);

    organizationLearnersWithSameNationalStudentIdsAsImported.forEach((organizationLearner: $TSFixMe) => {
      const alreadyReconciledStudentToImport = studentsToImport.find(
        (studentToImport: $TSFixMe) => studentToImport.userId === organizationLearner.account.userId
      );

      if (alreadyReconciledStudentToImport) {
        alreadyReconciledStudentToImport.userId = null;
        return;
      }

      const studentToImport = studentsToImport.find(
        (studentToImport: $TSFixMe) => studentToImport.nationalStudentId === organizationLearner.nationalStudentId
      );

      if (
        _shouldStudentToImportBeReconciled(
          allOrganizationLearnersInSameOrganization,
          organizationLearner,
          studentToImport
        )
      ) {
        studentToImport.userId = organizationLearner.account.userId;
      }
    });
    return studentsToImport;
  },

  async findByOrganizationIdAndBirthdate({
    organizationId,
    birthdate
  }: $TSFixMe) {
    const organizationLearners = await BookshelfOrganizationLearner.query((qb: $TSFixMe) => {
      qb.where('organizationId', organizationId);
      qb.where('birthdate', birthdate);
      qb.where('isDisabled', false);
    }).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganizationLearner, organizationLearners);
  },

  async reconcileUserToOrganizationLearner({
    userId,
    organizationLearnerId
  }: $TSFixMe) {
    try {
      const organizationLearner = await BookshelfOrganizationLearner.where({ id: organizationLearnerId })
        .where('isDisabled', false)
        .save(
          { userId },
          {
            patch: true,
          }
        );
      return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationLearner, organizationLearner);
    } catch (error) {
      throw new UserCouldNotBeReconciledError();
    }
  },

  async reconcileUserByNationalStudentIdAndOrganizationId({
    nationalStudentId,
    userId,
    organizationId
  }: $TSFixMe) {
    try {
      const organizationLearner = await BookshelfOrganizationLearner.where({
        organizationId,
        nationalStudentId,
        isDisabled: false,
      }).save({ userId }, { patch: true });
      return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationLearner, organizationLearner);
    } catch (error) {
      throw new UserCouldNotBeReconciledError();
    }
  },

  async getOrganizationLearnerForAdmin(organizationLearnerId: $TSFixMe) {
    const organizationLearner = await knex('organization-learners')
      .select(
        'organization-learners.id as id',
        'firstName',
        'lastName',
        'birthdate',
        'division',
        'group',
        'organizationId',
        'organizations.name as organizationName',
        'organization-learners.createdAt as createdAt',
        'organization-learners.updatedAt as updatedAt',
        'isDisabled',
        'organizations.isManagingStudents as organizationIsManagingStudents'
      )
      .innerJoin('organizations', 'organizations.id', 'organization-learners.organizationId')
      .where({ 'organization-learners.id': organizationLearnerId })
      .first();

    if (!organizationLearner) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Organization Learner not found for ID ${organizationLearnerId}`);
    }
    return new OrganizationLearnerForAdmin(organizationLearner);
  },

  async dissociateUserFromOrganizationLearner(organizationLearnerId: $TSFixMe) {
    await BookshelfOrganizationLearner.where({ id: organizationLearnerId }).save(
      { userId: null },
      {
        patch: true,
      }
    );
  },

  async findOneByUserIdAndOrganizationId({
    userId,
    organizationId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const organizationLearner = await knex('organization-learners')
      .transacting(domainTransaction)
      .first('*')
      .where({ userId, organizationId });
    if (!organizationLearner) return null;
    return new OrganizationLearner(organizationLearner);
  },

  get(organizationLearnerId: $TSFixMe) {
    return BookshelfOrganizationLearner.where({ id: organizationLearnerId })
      .fetch()
      .then((organizationLearner: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationLearner, organizationLearner)
      )
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfOrganizationLearner.NotFoundError) {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
          throw new NotFoundError(`Student not found for ID ${organizationLearnerId}`);
        }
        throw err;
      });
  },

  async getLatestOrganizationLearner({
    nationalStudentId,
    birthdate
  }: $TSFixMe) {
    const organizationLearner = await knex
      .where({ nationalStudentId, birthdate })
      .whereNotNull('userId')
      .select()
      .from('organization-learners')
      .orderBy('updatedAt', 'desc')
      .first();

    if (!organizationLearner) {
      throw new UserNotFoundError();
    }

    return organizationLearner;
  },

  async findPaginatedFilteredOrganizationLearners({
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
        'organization-learners.group',
        'organization-learners.studentNumber',
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
      .modify(_setOrganizationLearnerFilters, filter)
      .orderByRaw('?? ASC, ?? ASC', ['lowerLastName', 'lowerFirstName']);

    const { results, pagination } = await fetchPage(query, page);

    const organizationLearners = results.map((result: $TSFixMe) => {
      return new UserWithOrganizationLearner({
        ...result,
        isAuthenticatedFromGAR: !!result.samlId,
      });
    });
    return {
      data: organizationLearners,
      pagination,
    };
  },

  updateUserIdWhereNull({
    organizationLearnerId,
    userId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    return BookshelfOrganizationLearner.where({ id: organizationLearnerId, userId: null })
      .save(
        { userId },
        {
          transacting: domainTransaction.knexTransaction,
          patch: true,
          method: 'update',
        }
      )
      .then((organizationLearner: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationLearner, organizationLearner)
      )
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfOrganizationLearner.NoRowsUpdatedError) {
          throw new OrganizationLearnerNotFound(
            `OrganizationLearner not found for ID ${organizationLearnerId} and user ID null.`
          );
        }
        throw err;
      });
  },

  async isActive({
    userId,
    campaignId
  }: $TSFixMe) {
    const learner = await knex('organization-learners')
      .select('organization-learners.isDisabled')
      .join('organizations', 'organizations.id', 'organization-learners.organizationId')
      .join('campaigns', 'campaigns.organizationId', 'organizations.id')
      .where({ 'campaigns.id': campaignId })
      .andWhere({ 'organization-learners.userId': userId })
      .first();
    return !learner?.isDisabled;
  },
};
