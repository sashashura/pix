// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ResetPasswordDemand = require('../orm-models/ResetPasswordDemand');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PasswordRe... Remove this comment to see the full error message
const { PasswordResetDemandNotFoundError } = require('../../../lib/domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create(demand: $TSFixMe) {
    return new ResetPasswordDemand(demand).save();
  },

  markAsBeingUsed(email: $TSFixMe) {
    return ResetPasswordDemand.query((qb: $TSFixMe) => qb.whereRaw('LOWER("email") = ?', email.toLowerCase())).save(
      { used: true },
      {
        patch: true,
        require: false,
      }
    );
  },

  findByTemporaryKey(temporaryKey: $TSFixMe) {
    return ResetPasswordDemand.where({ temporaryKey, used: false })
      .fetch()
      .catch((err: $TSFixMe) => {
        if (err instanceof ResetPasswordDemand.NotFoundError) {
          throw new PasswordResetDemandNotFoundError();
        }
        throw err;
      });
  },

  findByUserEmail(email: $TSFixMe, temporaryKey: $TSFixMe) {
    return ResetPasswordDemand.query((qb: $TSFixMe) => {
      qb.whereRaw('LOWER("email") = ?', email.toLowerCase());
      qb.where({ used: false });
      qb.where({ temporaryKey });
    })
      .fetch()
      .catch((err: $TSFixMe) => {
        if (err instanceof ResetPasswordDemand.NotFoundError) {
          throw new PasswordResetDemandNotFoundError();
        }
        throw err;
      });
  },
};
