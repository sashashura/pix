// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUser = require('../orm-models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfM... Remove this comment to see the full error message
const BookshelfMembership = require('../orm-models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUserOrgaSettings = require('../orm-models/UserOrgaSettings');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess, UserNotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Prescriber... Remove this comment to see the full error message
const Prescriber = require('../../domain/read-models/Prescriber');

function _toPrescriberDomain(bookshelfUser: $TSFixMe) {
  const { id, firstName, lastName, pixOrgaTermsOfServiceAccepted, lang } = bookshelfUser.toJSON();
  return new Prescriber({
    id,
    firstName,
    lastName,
    pixOrgaTermsOfServiceAccepted,
    lang,
    memberships: bookshelfToDomainConverter.buildDomainObjects(
      BookshelfMembership,
      bookshelfUser.related('memberships')
    ),
    userOrgaSettings: bookshelfToDomainConverter.buildDomainObject(
      BookshelfUserOrgaSettings,
      bookshelfUser.related('userOrgaSettings')
    ),
  });
}

async function _areNewYearOrganizationLearnersImportedForPrescriber(prescriber: $TSFixMe) {
  const currentOrganizationId = prescriber.userOrgaSettings.id
    ? prescriber.userOrgaSettings.currentOrganization.id
    : prescriber.memberships[0].organization.id;
  const atLeastOneOrganizationLearner = await knex('organizations')
    .select('organizations.id')
    .join('organization-learners', 'organization-learners.organizationId', 'organizations.id')
    .where((qb: $TSFixMe) => {
      qb.where('organizations.id', currentOrganizationId);
      if (settings.features.newYearOrganizationLearnersImportDate) {
        qb.where('organization-learners.createdAt', '>=', settings.features.newYearOrganizationLearnersImportDate);
      }
    })
    .first();

  prescriber.areNewYearOrganizationLearnersImported = Boolean(atLeastOneOrganizationLearner);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getPrescriber(userId: $TSFixMe) {
    try {
      const prescriberFromDB = await BookshelfUser.where({ id: userId }).fetch({
        columns: ['id', 'firstName', 'lastName', 'pixOrgaTermsOfServiceAccepted', 'lang'],
        withRelated: [
          { memberships: (qb: $TSFixMe) => qb.where({ disabledAt: null }).orderBy('id') },
          'memberships.organization',
          'userOrgaSettings',
          'userOrgaSettings.currentOrganization',
          'userOrgaSettings.currentOrganization.tags',
        ],
      });
      const prescriber = _toPrescriberDomain(prescriberFromDB);

      if (_.isEmpty(prescriber.memberships)) {
        throw new ForbiddenAccess(`User of ID ${userId} is not a prescriber`);
      }

      await _areNewYearOrganizationLearnersImportedForPrescriber(prescriber);

      return prescriber;
    } catch (err) {
      if (err instanceof BookshelfUser.NotFoundError) {
        throw new UserNotFoundError(`User not found for ID ${userId}`);
      }
      throw err;
    }
  },
};
