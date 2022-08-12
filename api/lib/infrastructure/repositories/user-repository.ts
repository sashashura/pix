// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUser = require('../orm-models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isUniqCons... Remove this comment to see the full error message
const { isUniqConstraintViolated } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingEntityError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
const UserDetailsForAdmin = require('../../domain/models/UserDetailsForAdmin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../domain/models/CertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenterMembership = require('../../domain/models/CertificationCenterMembership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerForAdmin = require('../../domain/read-models/OrganizationLearnerForAdmin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getByEmail(email: $TSFixMe) {
    return BookshelfUser.query((qb: $TSFixMe) => {
      qb.whereRaw('LOWER("email") = ?', email.toLowerCase());
    })
      .fetch()
      .then((bookshelfUser: $TSFixMe) => {
        return _toDomain(bookshelfUser);
      })
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for email ${email}`);
        }
        throw err;
      });
  },

  getByUsernameOrEmailWithRolesAndPassword(username: $TSFixMe) {
    return BookshelfUser.query((qb: $TSFixMe) => qb.where({ email: username.toLowerCase() }).orWhere({ username: username }))
      .fetch({
        require: false,
        withRelated: [
          { memberships: (qb: $TSFixMe) => qb.where({ disabledAt: null }) },
          { certificationCenterMemberships: (qb: $TSFixMe) => qb.where({ disabledAt: null }) },
          'memberships.organization',
          'certificationCenterMemberships.certificationCenter',
          { authenticationMethods: (qb: $TSFixMe) => qb.where({ identityProvider: 'PIX' }) },
        ],
      })
      .then((foundUser: $TSFixMe) => {
        if (foundUser === null) {
          return Promise.reject(new UserNotFoundError());
        }
        return _toDomain(foundUser);
      });
  },

  /**
   * @deprecated Use getById instead
   */
  get(userId: $TSFixMe) {
    return BookshelfUser.where({ id: userId })
      .fetch()
      .then((user: $TSFixMe) => bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user))
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  async getById(userId: $TSFixMe) {
    const foundUser = await knex.from('users').where({ id: userId }).first();
    if (!foundUser) {
      throw new UserNotFoundError();
    }
    return new User(foundUser);
  },

  getForObfuscation(userId: $TSFixMe) {
    return BookshelfUser.where({ id: userId })
      .fetch({ columns: ['id', 'email', 'username'] })
      .then((userAuthenticationMethods: $TSFixMe) => _toUserAuthenticationMethods(userAuthenticationMethods))
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  getUserDetailsForAdmin(userId: $TSFixMe) {
    return BookshelfUser.where({ id: userId })
      .fetch({
        columns: [
          'id',
          'firstName',
          'lastName',
          'email',
          'username',
          'cgu',
          'pixOrgaTermsOfServiceAccepted',
          'pixCertifTermsOfServiceAccepted',
          'createdAt',
          'lang',
          'lastTermsOfServiceValidatedAt',
          'lastPixOrgaTermsOfServiceValidatedAt',
          'lastPixCertifTermsOfServiceValidatedAt',
          'lastLoggedAt',
          'emailConfirmedAt',
        ],
        withRelated: [
          {
            organizationLearners: (query: $TSFixMe) => {
              query.leftJoin('organizations', 'organization-learners.organizationId', 'organizations.id').orderBy('id');
            },
          },
          'organizationLearners.organization',
          'authenticationMethods',
        ],
      })
      .then((userDetailsForAdmin: $TSFixMe) => _toUserDetailsForAdminDomain(userDetailsForAdmin))
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  findPaginatedFiltered({
    filter,
    page
  }: $TSFixMe) {
    return BookshelfUser.query((qb: $TSFixMe) => _setSearchFiltersForQueryBuilder(filter, qb))
      .fetchPage({
        page: page.number,
        pageSize: page.size,
      })
      .then(({
      models,
      pagination
    }: $TSFixMe) => {
        const users = bookshelfToDomainConverter.buildDomainObjects(BookshelfUser, models);
        return { models: users, pagination };
      });
  },

  getWithMemberships(userId: $TSFixMe) {
    return BookshelfUser.where({ id: userId })
      .fetch({
        require: false,
        withRelated: [{ memberships: (qb: $TSFixMe) => qb.where({ disabledAt: null }) }, 'memberships.organization'],
      })
      .then((foundUser: $TSFixMe) => {
        if (foundUser === null) {
          return Promise.reject(new UserNotFoundError(`User not found for ID ${userId}`));
        }
        return _toDomain(foundUser);
      });
  },

  getWithCertificationCenterMemberships(userId: $TSFixMe) {
    return BookshelfUser.where({ id: userId })
      .fetch({
        withRelated: [
          { certificationCenterMemberships: (qb: $TSFixMe) => qb.where({ disabledAt: null }) },
          'certificationCenterMemberships.certificationCenter',
        ],
      })
      .then(_toDomain)
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  async getBySamlId(samlId: $TSFixMe) {
    const bookshelfUser = await BookshelfUser.query((qb: $TSFixMe) => {
      qb.innerJoin('authentication-methods', function(this: $TSFixMe) {
        this.on('users.id', 'authentication-methods.userId')
          .andOnVal('authentication-methods.identityProvider', AuthenticationMethod.identityProviders.GAR)
          .andOnVal('authentication-methods.externalIdentifier', samlId);
      });
    }).fetch({ require: false, withRelated: 'authenticationMethods' });
    return bookshelfUser ? _toDomain(bookshelfUser) : null;
  },

  updateWithEmailConfirmed({
    id,
    userAttributes,
    domainTransaction: { knexTransaction } = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const query = knex('users').where({ id }).update(userAttributes);
    if (knexTransaction) query.transacting(knexTransaction);
    return query;
  },

  checkIfEmailIsAvailable(email: $TSFixMe) {
    return BookshelfUser.query((qb: $TSFixMe) => qb.whereRaw('LOWER("email") = ?', email.toLowerCase()))
      .fetch({ require: false })
      .then((user: $TSFixMe) => {
        if (user) {
          return Promise.reject(new AlreadyRegisteredEmailError());
        }

        return Promise.resolve(email);
      });
  },

  isUserExistingByEmail(email: $TSFixMe) {
    return BookshelfUser.where({ email: email.toLowerCase() })
      .fetch()
      .then(() => true)
      .catch(() => {
        throw new UserNotFoundError();
      });
  },

  updatePassword(id: $TSFixMe, hashedPassword: $TSFixMe) {
    return BookshelfUser.where({ id })
      .save({ password: hashedPassword }, { patch: true, method: 'update' })
      .then((bookshelfUser: $TSFixMe) => _toDomain(bookshelfUser))
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  updateEmail({
    id,
    email
  }: $TSFixMe) {
    return BookshelfUser.where({ id })
      .save({ email }, { patch: true, method: 'update' })
      .then((bookshelfUser: $TSFixMe) => _toDomain(bookshelfUser))
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  async updateUserDetailsForAdministration(id: $TSFixMe, userAttributes: $TSFixMe) {
    try {
      const updatedUser = await BookshelfUser.where({ id }).save(userAttributes, { patch: true, method: 'update' });
      await updatedUser.related('authenticationMethods').fetch({ require: false });
      return _toUserDetailsForAdminDomain(updatedUser);
    } catch (err) {
      if (err instanceof BookshelfUser.NoRowsUpdatedError) {
        throw new UserNotFoundError(`User not found for ID ${id}`);
      }
      if (isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError('Cette adresse e-mail ou cet identifiant est déjà utilisé(e).');
      }
      throw err;
    }
  },

  async updateHasSeenAssessmentInstructionsToTrue(id: $TSFixMe) {
    const user = await BookshelfUser.where({ id }).fetch({ require: false });
    await user.save({ hasSeenAssessmentInstructions: true }, { patch: true, method: 'update' });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async updateHasSeenNewDashboardInfoToTrue(id: $TSFixMe) {
    const user = await BookshelfUser.where({ id }).fetch({ require: false });
    await user.save({ hasSeenNewDashboardInfo: true }, { patch: true, method: 'update' });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async updateHasSeenChallengeTooltip({
    userId,
    challengeType
  }: $TSFixMe) {
    const user = await BookshelfUser.where({ id: userId }).fetch({ require: false });
    if (challengeType === 'focused') {
      await user.save({ hasSeenFocusedChallengeTooltip: true }, { patch: true, method: 'update' });
    }
    if (challengeType === 'other') {
      await user.save({ hasSeenOtherChallengesTooltip: true }, { patch: true, method: 'update' });
    }
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async acceptPixLastTermsOfService(id: $TSFixMe) {
    const user = await BookshelfUser.where({ id }).fetch({ require: false });
    await user.save(
      {
        lastTermsOfServiceValidatedAt: moment().toDate(),
        mustValidateTermsOfService: false,
      },
      { patch: true, method: 'update' }
    );
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async updatePixOrgaTermsOfServiceAcceptedToTrue(id: $TSFixMe) {
    const now = new Date();

    const [user] = await knex('users')
      .where({ id })
      .update({ pixOrgaTermsOfServiceAccepted: true, lastPixOrgaTermsOfServiceValidatedAt: now, updatedAt: now })
      .returning('*');

    return new User(user);
  },

  async updatePixCertifTermsOfServiceAcceptedToTrue(id: $TSFixMe) {
    const now = new Date();

    const [user] = await knex('users')
      .where({ id })
      .update({ pixCertifTermsOfServiceAccepted: true, lastPixCertifTermsOfServiceValidatedAt: now, updatedAt: now })
      .returning('*');

    return new User(user);
  },

  async isUsernameAvailable(username: $TSFixMe) {
    const foundUser = await BookshelfUser.where({ username }).fetch({ require: false });
    if (foundUser) {
      throw new AlreadyRegisteredUsernameError();
    }
    return username;
  },

  updateUsername({
    id,
    username,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    return BookshelfUser.where({ id })
      .save(
        { username },
        {
          transacting: domainTransaction.knexTransaction,
          patch: true,
          method: 'update',
        }
      )
      .then((bookshelfUser: $TSFixMe) => _toDomain(bookshelfUser))
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  addUsername(id: $TSFixMe, username: $TSFixMe) {
    return BookshelfUser.where({ id })
      .save({ username }, { patch: true, method: 'update' })
      .then((bookshelfUser: $TSFixMe) => _toDomain(bookshelfUser))
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  async updateUserAttributes(id: $TSFixMe, userAttributes: $TSFixMe) {
    try {
      const bookshelfUser = await BookshelfUser.where({ id }).save(userAttributes, { patch: true, method: 'update' });
      return _toDomain(bookshelfUser);
    } catch (err) {
      if (err instanceof BookshelfUser.NoRowsUpdatedError) {
        throw new UserNotFoundError(`User not found for ID ${id}`);
      }
      throw err;
    }
  },

  async findByExternalIdentifier({
    externalIdentityId,
    identityProvider
  }: $TSFixMe) {
    const bookshelfUser = await BookshelfUser.query((qb: $TSFixMe) => {
      qb.innerJoin('authentication-methods', function(this: $TSFixMe) {
        this.on('users.id', 'authentication-methods.userId')
          .andOnVal('authentication-methods.identityProvider', identityProvider)
          .andOnVal('authentication-methods.externalIdentifier', externalIdentityId);
      });
    }).fetch({ require: false, withRelated: 'authenticationMethods' });
    return bookshelfUser ? _toDomain(bookshelfUser) : null;
  },

  async findAnotherUserByEmail(userId: $TSFixMe, email: $TSFixMe) {
    return BookshelfUser.where('id', '!=', userId)
      .where({ email: email.toLowerCase() })
      .fetchAll()
      .then((users: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfUser, users));
  },

  async findAnotherUserByUsername(userId: $TSFixMe, username: $TSFixMe) {
    return BookshelfUser.where('id', '!=', userId)
      .where({ username })
      .fetchAll()
      .then((users: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfUser, users));
  },

  async updateLastLoggedAt({
    userId
  }: $TSFixMe) {
    const now = new Date();

    await knex('users').where({ id: userId }).update({ lastLoggedAt: now });
  },
};

function _toUserDetailsForAdminDomain(bookshelfUser: $TSFixMe) {
  const rawUserDetailsForAdmin = bookshelfUser.toJSON();
  return new UserDetailsForAdmin({
    id: rawUserDetailsForAdmin.id,
    firstName: rawUserDetailsForAdmin.firstName,
    lastName: rawUserDetailsForAdmin.lastName,
    birthdate: rawUserDetailsForAdmin.birthdate,
    organizationId: rawUserDetailsForAdmin.organizationId,
    username: rawUserDetailsForAdmin.username,
    email: rawUserDetailsForAdmin.email,
    cgu: rawUserDetailsForAdmin.cgu,
    pixOrgaTermsOfServiceAccepted: rawUserDetailsForAdmin.pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted: rawUserDetailsForAdmin.pixCertifTermsOfServiceAccepted,
    createdAt: rawUserDetailsForAdmin.createdAt,
    lang: rawUserDetailsForAdmin.lang,
    lastTermsOfServiceValidatedAt: rawUserDetailsForAdmin.lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt: rawUserDetailsForAdmin.lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt: rawUserDetailsForAdmin.lastPixCertifTermsOfServiceValidatedAt,
    lastLoggedAt: rawUserDetailsForAdmin.lastLoggedAt,
    emailConfirmedAt: rawUserDetailsForAdmin.emailConfirmedAt,
    organizationLearners: _toOrganizationLearnersForAdmin(rawUserDetailsForAdmin.organizationLearners),
    authenticationMethods: rawUserDetailsForAdmin.authenticationMethods,
  });
}

function _toOrganizationLearnersForAdmin(organizationLearners: $TSFixMe) {
  if (!organizationLearners) {
    return [];
  }
  return organizationLearners.map((organizationLearner: $TSFixMe) => {
    return new OrganizationLearnerForAdmin({
      id: organizationLearner.id,
      firstName: organizationLearner.firstName,
      lastName: organizationLearner.lastName,
      birthdate: organizationLearner.birthdate,
      division: organizationLearner.division,
      group: organizationLearner.group,
      organizationId: organizationLearner.organization.id,
      organizationName: organizationLearner.organization.name,
      createdAt: organizationLearner.createdAt,
      updatedAt: organizationLearner.updatedAt,
      isDisabled: organizationLearner.isDisabled,
      organizationIsManagingStudents: organizationLearner.organization.isManagingStudents,
    });
  });
}

function _toUserAuthenticationMethods(bookshelfUser: $TSFixMe) {
  const rawUser = bookshelfUser.toJSON();
  return new User({
    id: rawUser.id,
    email: rawUser.email,
    username: rawUser.username,
  });
}

function _toCertificationCenterMembershipsDomain(certificationCenterMembershipBookshelf: $TSFixMe) {
  return certificationCenterMembershipBookshelf.map((bookshelf: $TSFixMe) => {
    return new CertificationCenterMembership({
      id: bookshelf.get('id'),
      certificationCenter: new CertificationCenter({
        id: bookshelf.related('certificationCenter').get('id'),
        name: bookshelf.related('certificationCenter').get('name'),
      }),
    });
  });
}

function _toMembershipsDomain(membershipsBookshelf: $TSFixMe) {
  return membershipsBookshelf.map((membershipBookshelf: $TSFixMe) => {
    return new Membership({
      id: membershipBookshelf.get('id'),
      organizationRole: membershipBookshelf.get('organizationRole'),
      organization: new Organization({
        id: membershipBookshelf.related('organization').get('id'),
        code: membershipBookshelf.related('organization').get('code'),
        name: membershipBookshelf.related('organization').get('name'),
        type: membershipBookshelf.related('organization').get('type'),
        isManagingStudents: Boolean(membershipBookshelf.related('organization').get('isManagingStudents')),
        externalId: membershipBookshelf.related('organization').get('externalId'),
      }),
    });
  });
}

function _getAuthenticationComplementAndExternalIdentifier(authenticationMethodBookshelf: $TSFixMe) {
  const identityProvider = authenticationMethodBookshelf.get('identityProvider');

  let authenticationComplement = authenticationMethodBookshelf.get('authenticationComplement');
  let externalIdentifier = authenticationMethodBookshelf.get('externalIdentifier');

  if (identityProvider === AuthenticationMethod.identityProviders.PIX) {
    authenticationComplement = new AuthenticationMethod.PixAuthenticationComplement({
      password: authenticationComplement.password,
      shouldChangePassword: Boolean(authenticationComplement.shouldChangePassword),
    });
    externalIdentifier = undefined;
  } else if (identityProvider === AuthenticationMethod.identityProviders.POLE_EMPLOI) {
    authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
      accessToken: authenticationComplement.accessToken,
      refreshToken: authenticationComplement.refreshToken,
      expiredDate: authenticationComplement.expiredDate,
    });
  }

  return { authenticationComplement, externalIdentifier };
}

function _toAuthenticationMethodsDomain(authenticationMethodsBookshelf: $TSFixMe) {
  return authenticationMethodsBookshelf.map((authenticationMethodBookshelf: $TSFixMe) => {
    const { authenticationComplement, externalIdentifier } =
      _getAuthenticationComplementAndExternalIdentifier(authenticationMethodBookshelf);

    return new AuthenticationMethod({
      id: authenticationMethodBookshelf.get('id'),
      userId: authenticationMethodBookshelf.get('userId'),
      identityProvider: authenticationMethodBookshelf.get('identityProvider'),
      externalIdentifier,
      authenticationComplement,
    });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(userBookshelf: $TSFixMe) {
  return new User({
    id: userBookshelf.get('id'),
    firstName: userBookshelf.get('firstName'),
    lastName: userBookshelf.get('lastName'),
    email: userBookshelf.get('email'),
    emailConfirmedAt: userBookshelf.get('emailConfirmedAt'),
    username: userBookshelf.get('username'),
    password: userBookshelf.get('password'),
    shouldChangePassword: Boolean(userBookshelf.get('shouldChangePassword')),
    cgu: Boolean(userBookshelf.get('cgu')),
    lang: userBookshelf.get('lang'),
    isAnonymous: Boolean(userBookshelf.get('isAnonymous')),
    lastTermsOfServiceValidatedAt: userBookshelf.get('lastTermsOfServiceValidatedAt'),
    hasSeenNewDashboardInfo: Boolean(userBookshelf.get('hasSeenNewDashboardInfo')),
    mustValidateTermsOfService: Boolean(userBookshelf.get('mustValidateTermsOfService')),
    pixOrgaTermsOfServiceAccepted: Boolean(userBookshelf.get('pixOrgaTermsOfServiceAccepted')),
    pixCertifTermsOfServiceAccepted: Boolean(userBookshelf.get('pixCertifTermsOfServiceAccepted')),
    memberships: _toMembershipsDomain(userBookshelf.related('memberships')),
    certificationCenterMemberships: _toCertificationCenterMembershipsDomain(
      userBookshelf.related('certificationCenterMemberships')
    ),
    hasSeenAssessmentInstructions: Boolean(userBookshelf.get('hasSeenAssessmentInstructions')),
    authenticationMethods: _toAuthenticationMethodsDomain(userBookshelf.related('authenticationMethods')),
  });
}

function _setSearchFiltersForQueryBuilder(filter: $TSFixMe, qb: $TSFixMe) {
  const { firstName, lastName, email, username } = filter;

  if (firstName) {
    qb.whereRaw('LOWER("firstName") LIKE ?', `%${firstName.toLowerCase()}%`);
  }
  if (lastName) {
    qb.whereRaw('LOWER("lastName") LIKE ?', `%${lastName.toLowerCase()}%`);
  }
  if (email) {
    qb.whereRaw('LOWER("email") LIKE ?', `%${email.toLowerCase()}%`);
  }
  if (username) {
    qb.whereRaw('LOWER("username") LIKE ?', `%${username.toLowerCase()}%`);
  }
}
