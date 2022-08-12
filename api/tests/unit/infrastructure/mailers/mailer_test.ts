// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailing'.
const { mailing } = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailCheck'... Remove this comment to see the full error message
const mailCheck = require('../../../../lib/infrastructure/mail-check');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailer'.
const mailer = require('../../../../lib/infrastructure/mailers/mailer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EmailingAt... Remove this comment to see the full error message
const EmailingAttempt = require('../../../../lib/domain/models/EmailingAttempt');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Mailers | mailer', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(mailing, 'provider').value('sendinblue');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#sendEmail', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when mailing is disabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should resolve immediately and return a skip status', async function () {
        //given
        _disableMailing();
        const mailingProvider = _mockMailingProvider();

        const options = {
          from: 'bob.dylan@example.net',
          to: 'test@example.net',
          fromName: 'Ne Pas Repondre',
          subject: 'Creation de compte',
          template: '129291',
        };

        // when
        const result = await mailer.sendEmail(options);

        // then
        expect(result).to.deep.equal(EmailingAttempt.success('test@example.net'));
        expect(mailingProvider.sendEmail).to.have.not.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when mailing is enabled', function () {
      const recipient = 'test@example.net';

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when email check succeed', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should send email and return a success status', async function () {
          // given
          _enableMailing();
          _mailAddressIsValid(recipient);

          const mailingProvider = _mockMailingProvider();

          const from = 'no-reply@example.net';
          const options = {
            from,
            to: recipient,
            fromName: 'Ne Pas Repondre',
            subject: 'Creation de compte',
            template: '129291',
          };

          // when
          const result = await mailer.sendEmail(options);

          // then
          sinon.assert.calledWith(mailingProvider.sendEmail, options);
          expect(result).to.deep.equal(EmailingAttempt.success('test@example.net'));
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when email is invalid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should log a warning, and return an error status', async function () {
          // given
          _enableMailing();
          _mockMailingProvider();

          const expectedError = new Error('fail');
          _mailAddressIsInvalid(recipient, expectedError);

          sinon.stub(logger, 'warn');

          // when
          const result = await mailer.sendEmail({ to: recipient });

          // then
          expect(logger.warn).to.have.been.calledWith({ err: expectedError }, "Email is not valid 'test@example.net'");
          expect(result).to.deep.equal(EmailingAttempt.failure('test@example.net'));
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when emailing fails', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should log a warning and return an error status', async function () {
          // given
          _enableMailing();
          _mailAddressIsValid(recipient);
          const mailingProvider = _mockMailingProvider();
          const error = new Error('fail');
          mailingProvider.sendEmail.rejects(error);

          sinon.stub(logger, 'warn');

          // when
          const result = await mailer.sendEmail({ to: recipient });

          // then
          expect(logger.warn).to.have.been.calledOnceWith({ err: error }, "Could not send email to 'test@example.net'");
          expect(result).to.deep.equal(EmailingAttempt.failure('test@example.net'));
        });
      });
    });
  });
});

function _disableMailing() {
  sinon.stub(mailing, 'enabled').value(false);
}

function _enableMailing() {
  sinon.stub(mailing, 'enabled').value(true);
}

function _mailAddressIsValid(recipient: $TSFixMe) {
  sinon.stub(mailCheck, 'checkMail').withArgs(recipient).resolves();
}

function _mailAddressIsInvalid(recipient: $TSFixMe, expectedError: $TSFixMe) {
  sinon.stub(mailCheck, 'checkMail').withArgs(recipient).rejects(expectedError);
}

function _mockMailingProvider() {
  const mailingProvider = { sendEmail: sinon.stub() };
  mailingProvider.sendEmail.resolves();
  mailer._provider = mailingProvider;

  return mailingProvider;
}
