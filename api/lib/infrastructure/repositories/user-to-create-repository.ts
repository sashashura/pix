// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
const { AlreadyRegisteredUsernameError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../domain/models/User');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create({
    user,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: $TSFixMe) {
    const knexConnection = domainTransaction.knexTransaction || knex;

    if (user.username) {
      return await _createWithUsername({ knexConnection, user });
    } else {
      return await _createWithoutUsername({ knexConnection, user });
    }
  },
};

async function _createWithUsername({
  knexConnection,
  user
}: $TSFixMe) {
  const result = await knexConnection(
    knex.raw('?? (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??)', ['users', ...Object.keys(user)])
  )
    .insert(
      knex
        .select(knex.raw('?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?', Object.values(user)))
        .whereNotExists(knex('users').where({ username: user.username }))
    )
    .returning('*');

  if (result.length < 1) {
    throw new AlreadyRegisteredUsernameError();
  }
  return _toUserDomain(result[0]);
}

async function _createWithoutUsername({
  knexConnection,
  user
}: $TSFixMe) {
  const result = await knexConnection('users').insert(user).returning('*');
  return _toUserDomain(result[0]);
}

function _toUserDomain(userDTO: $TSFixMe) {
  return new User({
    id: userDTO.id,
    firstName: userDTO.firstName,
    lastName: userDTO.lastName,
    email: userDTO.email,
    emailConfirmedAt: userDTO.emailConfirmedAt,
    username: userDTO.username,
    password: userDTO.password,
    shouldChangePassword: Boolean(userDTO.shouldChangePassword),
    cgu: Boolean(userDTO.cgu),
    lang: userDTO.lang,
    isAnonymous: Boolean(userDTO.isAnonymous),
    lastTermsOfServiceValidatedAt: userDTO.lastTermsOfServiceValidatedAt,
    hasSeenNewDashboardInfo: Boolean(userDTO.hasSeenNewDashboardInfo),
    mustValidateTermsOfService: Boolean(userDTO.mustValidateTermsOfService),
    pixOrgaTermsOfServiceAccepted: Boolean(userDTO.pixOrgaTermsOfServiceAccepted),
    pixCertifTermsOfServiceAccepted: Boolean(userDTO.pixCertifTermsOfServiceAccepted),
    hasSeenAssessmentInstructions: Boolean(userDTO.hasSeenAssessmentInstructions),
  });
}
