// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SibApiV3Sdk = require('sib-api-v3-sdk');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MailingPro... Remove this comment to see the full error message
const MailingProvider = require('./MailingProvider');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mailing'.
const { mailing } = require('../../config');

function _formatPayload({
  to,
  fromName,
  from,
  subject,
  template,
  variables,
  tags
}: $TSFixMe) {
  const payload = {
    to: [
      {
        email: to,
      },
    ],
    sender: {
      name: fromName,
      email: from,
    },
    subject,
    templateId: parseInt(template),
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
  };

  if (variables) {
    (payload as $TSFixMe).params = variables;
  }

  if (_.isArray(tags) && !_.isEmpty(tags)) {
    (payload as $TSFixMe).tags = tags;
  }

  return payload;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Sendinblue... Remove this comment to see the full error message
class SendinblueProvider extends MailingProvider {
  _client: $TSFixMe;
  constructor() {
    super();

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = mailing.sendinblue.apiKey;

    this._client = SendinblueProvider.createSendinblueSMTPApi();
  }

  static createSendinblueSMTPApi() {
    return new SibApiV3Sdk.TransactionalEmailsApi();
  }

  // @ts-expect-error TS(2416): Property 'sendEmail' in type 'SendinblueProvider' ... Remove this comment to see the full error message
  sendEmail(options: $TSFixMe) {
    const payload = _formatPayload(options);
    return this._client.sendTransacEmail(payload);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SendinblueProvider;
