// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'accountRec... Remove this comment to see the full error message
const accountRecoveryController = require('../../../../lib/application/account-recovery/account-recovery-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'studentInf... Remove this comment to see the full error message
const studentInformationForAccountRecoverySerializer = require('../../../../lib/infrastructure/serializers/jsonapi/student-information-for-account-recovery-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | account-recovery-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sendEmailForAccountRecovery', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call sendEmailForAccountRecovery usecase and return 204', async function () {
      // given
      const newEmail = 'new_email@example.net';
      const studentInformation = {
        ineIna: '123456789BB',
        firstName: 'george',
        lastName: 'de cambridge',
        birthdate: '2013-07-22',
        email: 'new_email@example.net',
      };

      const request = {
        payload: {
          data: {
            attributes: {
              'ine-ina': '123456789BB',
              'first-name': 'george',
              'last-name': 'de cambridge',
              birthdate: '2013-07-22',
              email: newEmail,
            },
          },
        },
      };

      sinon
        .stub(studentInformationForAccountRecoverySerializer, 'deserialize')
        .withArgs(request.payload)
        .resolves(studentInformation);
      sinon.stub(usecases, 'sendEmailForAccountRecovery').resolves();

      // when
      const response = await accountRecoveryController.sendEmailForAccountRecovery(request, hFake);

      // then
      expect(usecases.sendEmailForAccountRecovery).calledWith({ studentInformation });
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAccountRecoveryDemand', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return serialized account recovery details', async function () {
      // given
      const temporaryKey = 'ABCDEFZEFDD';
      const studentInformation = { id: 1234, email: 'philipe@example.net', firstName: 'philipe' };
      const request = {
        params: { temporaryKey },
      };
      sinon.stub(usecases, 'getAccountRecoveryDetails');
      sinon.stub(studentInformationForAccountRecoverySerializer, 'serializeAccountRecovery');
      usecases.getAccountRecoveryDetails.resolves(studentInformation);

      // when
      await accountRecoveryController.checkAccountRecoveryDemand(request, hFake);

      // then
      expect(usecases.getAccountRecoveryDetails).to.have.been.calledWith({ temporaryKey });
      expect(studentInformationForAccountRecoverySerializer.serializeAccountRecovery).to.have.been.calledWith(
        studentInformation
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateUserForAccountRecovery', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call updateUserForAccountRecovery usecase and return 204', async function () {
      // given
      const user = domainBuilder.buildUser({ id: 1 });
      const temporaryKey = 'validTemporaryKey';
      const domainTransaction = Symbol();

      const request = {
        params: {
          id: user.id,
        },
        payload: {
          data: {
            attributes: {
              password: user.password,
              'temporary-key': temporaryKey,
            },
          },
        },
      };

      sinon.stub(usecases, 'updateUserForAccountRecovery').resolves();
      DomainTransaction.execute = (lambda: $TSFixMe) => {
        return lambda(domainTransaction);
      };

      // when
      const response = await accountRecoveryController.updateUserAccountFromRecoveryDemand(request, hFake);

      // then
      expect(usecases.updateUserForAccountRecovery).calledWithMatch({
        password: user.password,
        temporaryKey,
        domainTransaction,
      });
      expect(response.statusCode).to.equal(204);
    });
  });
});
