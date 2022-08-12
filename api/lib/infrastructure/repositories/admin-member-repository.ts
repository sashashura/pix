// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AdminMembe... Remove this comment to see the full error message
const AdminMember = require('../../domain/models/AdminMember');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AdminMembe... Remove this comment to see the full error message
const { AdminMemberError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'pix-admin-roles';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findAll: async function () {
    const members = await knex
      .select(`${TABLE_NAME}.id`, 'users.id as userId', 'firstName', 'lastName', 'email', 'role')
      .from(TABLE_NAME)
      .where({ disabledAt: null })
      .join('users', 'users.id', `${TABLE_NAME}.userId`)
      .orderBy(['firstName', 'lastName']);

    return members.map((member: $TSFixMe) => new AdminMember(member));
  },

  getById: async function (id: $TSFixMe) {
    const adminMember = await knex
      .select(`${TABLE_NAME}.id`, 'users.id as userId', 'firstName', 'lastName', 'email', 'role', 'disabledAt')
      .from(TABLE_NAME)
      .where({ 'pix-admin-roles.id': id })
      .join('users', 'users.id', `${TABLE_NAME}.userId`)
      .first();

    return adminMember ? new AdminMember(adminMember) : undefined;
  },

  get: async function ({
    userId
  }: $TSFixMe) {
    const adminMember = await knex
      .select(`${TABLE_NAME}.id`, 'users.id as userId', 'firstName', 'lastName', 'email', 'role', 'disabledAt')
      .from(TABLE_NAME)
      .where({ userId })
      .join('users', 'users.id', `${TABLE_NAME}.userId`)
      .first();

    return adminMember ? new AdminMember(adminMember) : undefined;
  },

  async update({
    id,
    attributesToUpdate
  }: $TSFixMe) {
    const now = new Date();
    const [updatedAdminMember] = await knex
      .from(TABLE_NAME)
      .where({ id })
      .update({ ...attributesToUpdate, updatedAt: now })
      .returning('*');

    if (!updatedAdminMember) {
      throw new AdminMemberError(
        'A problem occured while trying to update an admin member role',
        'UPDATE_ADMIN_MEMBER_ERROR'
      );
    }

    return new AdminMember(updatedAdminMember);
  },

  async save(pixAdminRole: $TSFixMe) {
    const [savedAdminMember] = await knex(TABLE_NAME).insert(pixAdminRole).returning('*');
    return new AdminMember(savedAdminMember);
  },

  async deactivate({
    id
  }: $TSFixMe) {
    const now = new Date();
    const [deactivateddAdminMember] = await knex
      .from('pix-admin-roles')
      .where({ id })
      .whereRaw('"disabledAt" IS NULL')
      .update({ disabledAt: now, updatedAt: now })
      .returning('*');

    if (!deactivateddAdminMember) {
      throw new AdminMemberError(
        'A problem occured while trying to deactivate an admin member',
        'DEACTIVATE_ADMIN_MEMBER_ERROR'
      );
    }
  },
};
