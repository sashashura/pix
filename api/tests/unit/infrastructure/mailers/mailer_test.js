const { expect, sinon, catchErr } = require('../../../test-helper');
const { mailing } = require('../../../../lib/config');
const mailCheck = require('../../../../lib/infrastructure/mail-check');
const logger = require('../../../../lib/infrastructure/logger');
const mailer = require('../../../../lib/infrastructure/mailers/mailer');

describe('Unit | Infrastructure | Mailers | mailer', () => {

  beforeEach(() => {
    sinon.stub(mailing, 'provider').value('sendinblue');
  });

  describe('#sendEmail', () => {

    const recipient = 'test@example.net';

    context('when mailing is disabled', () => {

      it('should resolve immediately', async () => {
        //given
        sinon.stub(mailing, 'enabled').value(false);
        const mailingProvider = _mockMailingProvider();

        const options = {
          from: 'bob.dylan@example.net',
          to: 'test@example.net',
          fromName: 'Ne Pas Repondre',
          subject: 'Creation de compte',
          template: '129291',
        };

        // when
        await mailer.sendEmail(options);

        // then
        expect(mailingProvider.sendEmail).not.to.have.been.called;
      });
    });

    context('when mailing is enabled', () => {

      beforeEach(() => {
        _mailingIsEnabled();
        const mailingProvider = { sendEmail: sinon.stub() };
        sinon.stub(mailer, '_provider').value(mailingProvider);
      });

      context('when email check succeed', () => {

        beforeEach(() => {
          sinon.stub(mailCheck, 'checkMail').withArgs(recipient).resolves();
        });

        it('should called email provider method _doSendEmail', async () => {
          // given
          const from = 'no-reply@example.net';
          mailer._provider.sendEmail.resolves();

          const options = {
            from,
            to: recipient,
            fromName: 'Ne Pas Repondre',
            subject: 'Creation de compte',
            template: '129291',
          };

          // when
          await mailer.sendEmail(options);

          // then
          sinon.assert.calledWith(mailer._provider.sendEmail, options);
        });
      });

      context('when email check fails', () => {
        let error;

        beforeEach(() => {
          error = new Error('fail');
          sinon.stub(mailCheck, 'checkMail').rejects(error);
          sinon.stub(logger, 'warn');
        });

        it('should log a warning, not send email and resolve', async () => {
          // when
          await mailer.sendEmail({ to: recipient });

          // then
          expect(logger.warn).to.have.been.calledWith({ err: error }, 'Email is not valid \'test@example.net\'');
        });
      });

      context('when emailing fails', () => {

        let error;

        beforeEach(() => {
          error = new Error('fail');
          sinon.stub(mailCheck, 'checkMail').resolves();
          sinon.stub(logger, 'warn');
        });

        it('should log a warning', async () => {
          // given
          mailer._provider.sendEmail.rejects(error);

          // when
          await mailer.sendEmail({ to: recipient });

          // then
          expect(logger.warn).to.have.been.calledWith({ err: error }, 'Could not send email to \'test@example.net\'');
        });
      });
    });
  });

  describe('#sendEmailUnsafe', () => {

    const recipient = 'test@example.net';

    context('when mailing is enabled', () => {

      context('when email check succeed', () => {

        it('should send email', async () => {
          // given
          _mailingIsEnabled();
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
          await mailer.sendEmailUnsafe(options);

          // then
          sinon.assert.calledWith(mailingProvider.sendEmail, options);
        });
      });

      context('when email check fails', () => {

        it('should log a warning, and throw', async () => {
          // given
          _mailingIsEnabled();
          _mockMailingProvider();

          const expectedError = new Error('fail');
          _mailAddressIsInvalid(recipient, expectedError);

          sinon.stub(logger, 'warn');

          // when
          const err = await catchErr(mailer.sendEmailUnsafe)({ to: recipient });

          // then
          expect(logger.warn).to.have.been.calledWith({ err: expectedError }, 'Email is not valid \'test@example.net\'');
          expect(err).to.equal(expectedError);
        });
      });

      context('when emailing fails', () => {

        it('should log a warning', async () => {
          // given
          _mailingIsEnabled();
          _mailAddressIsValid(recipient);
          const mailingProvider = _mockMailingProvider();
          const error = new Error('fail');
          mailingProvider.sendEmail.rejects(error);

          sinon.stub(logger, 'warn');

          // when
          const err = await catchErr(mailer.sendEmailUnsafe, mailer)({ to: recipient });

          // then
          expect(logger.warn).to.have.been.calledOnceWith({ err: error }, 'Could not send email to \'test@example.net\'');
          expect(err).to.equal(error);
        });
      });
    });
  });

});

function _mailingIsEnabled() {
  sinon.stub(mailing, 'enabled').value(true);
}

function _mailAddressIsValid(recipient) {
  sinon.stub(mailCheck, 'checkMail').withArgs(recipient).resolves();
}

function _mailAddressIsInvalid(recipient, expectedError) {
  sinon.stub(mailCheck, 'checkMail').rejects(expectedError);
}

function _mockMailingProvider() {
  const mailingProvider = { sendEmail: sinon.stub() };
  mailingProvider.sendEmail.resolves();
  mailer._provider = mailingProvider;

  return mailingProvider;
}
