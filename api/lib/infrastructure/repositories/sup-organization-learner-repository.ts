// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationLearnersCouldNotBeSavedError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfO... Remove this comment to see the full error message
const BookshelfOrganizationLearner = require('../orm-models/OrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');

const ATTRIBUTES_TO_SAVE = [
  'firstName',
  'middleName',
  'thirdName',
  'lastName',
  'preferredLastName',
  'studentNumber',
  'email',
  'diploma',
  'department',
  'educationalTeam',
  'group',
  'status',
  'birthdate',
  'organizationId',
];

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async updateStudentNumber(studentId: $TSFixMe, studentNumber: $TSFixMe) {
    await BookshelfOrganizationLearner.where('id', studentId).save(
      { studentNumber },
      {
        patch: true,
      }
    );
  },

  async findOneByStudentNumberAndBirthdate({
    organizationId,
    studentNumber,
    birthdate
  }: $TSFixMe) {
    const organizationLearner = await BookshelfOrganizationLearner.query((qb: $TSFixMe) => {
      qb.where('organizationId', organizationId);
      qb.where('birthdate', birthdate);
      qb.where('isDisabled', false);
      qb.whereRaw('LOWER(?)=LOWER(??)', [studentNumber, 'studentNumber']);
    }).fetch({ require: false });

    return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationLearner, organizationLearner);
  },

  async findOneByStudentNumber({
    organizationId,
    studentNumber
  }: $TSFixMe) {
    const organizationLearner = await BookshelfOrganizationLearner.query((qb: $TSFixMe) => {
      qb.where('organizationId', organizationId);
      qb.whereRaw('LOWER(?)=LOWER(??)', [studentNumber, 'studentNumber']);
    }).fetch({ require: false });

    return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationLearner, organizationLearner);
  },

  async addStudents(supOrganizationLearners: $TSFixMe) {
    await _upsertStudents(knex, supOrganizationLearners);
  },

  async replaceStudents(organizationId: $TSFixMe, supOrganizationLearners: $TSFixMe) {
    await knex.transaction(async (transaction: $TSFixMe) => {
      await _disableAllOrganizationLearners(transaction, organizationId);
      await _upsertStudents(transaction, supOrganizationLearners);
    });
  },
};

async function _disableAllOrganizationLearners(queryBuilder: $TSFixMe, organizationId: $TSFixMe) {
  await queryBuilder('organization-learners')
    .update({ isDisabled: true, updatedAt: knex.raw('CURRENT_TIMESTAMP') })
    .where({ organizationId, isDisabled: false });
}

async function _upsertStudents(queryBuilder: $TSFixMe, supOrganizationLearners: $TSFixMe) {
  const supOrganizationLearnersToInsert = supOrganizationLearners.map((supOrganizationLearner: $TSFixMe) => ({
    ..._.pick(supOrganizationLearner, ATTRIBUTES_TO_SAVE),
    status: supOrganizationLearner.studyScheme,
    isDisabled: false,
    updatedAt: knex.raw('CURRENT_TIMESTAMP')
  }));

  try {
    await queryBuilder('organization-learners')
      .insert(supOrganizationLearnersToInsert)
      .onConflict(['organizationId', 'studentNumber'])
      .merge();
  } catch (error) {
    throw new OrganizationLearnersCouldNotBeSavedError();
  }
}
