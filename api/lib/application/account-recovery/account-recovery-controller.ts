// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'studentInf... Remove this comment to see the full error message
const studentInformationForAccountRecoverySerializer = require('../../infrastructure/serializers/jsonapi/student-information-for-account-recovery-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async sendEmailForAccountRecovery(request: $TSFixMe, h: $TSFixMe) {
    const studentInformation = await studentInformationForAccountRecoverySerializer.deserialize(request.payload);

    await usecases.sendEmailForAccountRecovery({ studentInformation });

    return h.response().code(204);
  },

  async checkAccountRecoveryDemand(request: $TSFixMe) {
    const temporaryKey = request.params.temporaryKey;
    const studentInformation = await usecases.getAccountRecoveryDetails({ temporaryKey });
    return studentInformationForAccountRecoverySerializer.serializeAccountRecovery(studentInformation);
  },

  async updateUserAccountFromRecoveryDemand(request: $TSFixMe, h: $TSFixMe) {
    const temporaryKey = request.payload.data.attributes['temporary-key'];
    const password = request.payload.data.attributes.password;

    await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      await usecases.updateUserForAccountRecovery({
        password,
        temporaryKey,
        domainTransaction,
      });
    });

    return h.response().code(204);
  },
};
