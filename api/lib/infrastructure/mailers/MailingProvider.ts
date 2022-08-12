// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MailingPro... Remove this comment to see the full error message
class MailingProvider {
  async sendEmail(/* options */) {
    throw new Error('Method #sendEmail(options) must be overridden');
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = MailingProvider;
