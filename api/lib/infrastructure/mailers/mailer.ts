// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Sendinblue... Remove this comment to see the full error message
const SendinblueProvider = require('./SendinblueProvider');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailing'.
const { mailing } = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailCheck'... Remove this comment to see the full error message
const mailCheck = require('../mail-check');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EmailingAt... Remove this comment to see the full error message
const EmailingAttempt = require('../../domain/models/EmailingAttempt');

class Mailer {
  _provider: $TSFixMe;
  _providerName: $TSFixMe;
  constructor() {
    this._providerName = mailing.provider;

    switch (this._providerName) {
      case 'sendinblue':
        this._provider = new SendinblueProvider();
        break;
      default:
        logger.warn('Undefined mailing provider');
    }
  }

  async sendEmail(options: $TSFixMe) {
    if (!mailing.enabled) {
      return EmailingAttempt.success(options.to);
    }

    try {
      await mailCheck.checkMail(options.to);
    } catch (err) {
      logger.warn({ err }, `Email is not valid '${options.to}'`);
      return EmailingAttempt.failure(options.to);
    }

    try {
      await this._provider.sendEmail(options);
    } catch (err) {
      logger.warn({ err }, `Could not send email to '${options.to}'`);
      return EmailingAttempt.failure(options.to);
    }

    return EmailingAttempt.success(options.to);
  }

  get accountCreationTemplateId() {
    return mailing[this._providerName].templates.accountCreationTemplateId;
  }

  get passwordResetTemplateId() {
    return mailing[this._providerName].templates.passwordResetTemplateId;
  }

  get organizationInvitationTemplateId() {
    return mailing[this._providerName].templates.organizationInvitationTemplateId;
  }

  get organizationInvitationScoTemplateId() {
    return mailing[this._providerName].templates.organizationInvitationScoTemplateId;
  }

  get certificationResultTemplateId() {
    return mailing[this._providerName].templates.certificationResultTemplateId;
  }

  get emailChangeTemplateId() {
    return mailing[this._providerName].templates.emailChangeTemplateId;
  }

  get accountRecoveryTemplateId() {
    return mailing[this._providerName].templates.accountRecoveryTemplateId;
  }

  get emailVerificationCodeTemplateId() {
    return mailing[this._providerName].templates.emailVerificationCodeTemplateId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = new Mailer();
