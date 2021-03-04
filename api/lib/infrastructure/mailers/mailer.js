const MailingProvider = require('./MailingProvider');
const SendinblueProvider = require('./SendinblueProvider');
const { mailing } = require('../../config');
const logger = require('../logger');
const mailCheck = require('../mail-check');

class Mailer extends MailingProvider {

  constructor() {
    super();

    this._providerName = mailing.provider;

    switch (this._providerName) {
      case 'sendinblue':
        this._provider = new SendinblueProvider();
        break;
      default:
        logger.warn('Undefined mailing provider');
    }
  }

  async sendEmail(options) {
    try {
      await this.sendEmailUnsafe(options);
    }
    catch (err) {
      // c'est fait exprès
    }
  }

  async sendEmailUnsafe(options) {
    if (!mailing.enabled) {
      return;
    }

    try {
      await mailCheck.checkMail(options.to);
    }
    catch (err) {
      logger.warn({ err }, `Email is not valid '${options.to}'`);
      throw err;
    }

    try {
      await this._provider.sendEmail(options);
    }
    catch (err) {
      logger.warn({ err }, `Could not send email to '${options.to}'`);
      throw err;
    }
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

}

module.exports = new Mailer();
