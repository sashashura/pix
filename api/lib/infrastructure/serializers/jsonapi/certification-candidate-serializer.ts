// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../domain/models/CertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'WrongDateF... Remove this comment to see the full error message
const { WrongDateFormatError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
const { isValidDate } = require('../../utils/date-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificationCandidates: $TSFixMe) {
    return new Serializer('certification-candidate', {
      transform: function (certificationCandidate: $TSFixMe) {
        return {
          ...certificationCandidate,
          billingMode: certificationCandidate.translatedBillingMode,
          isLinked: !_.isNil(certificationCandidate.userId),
          schoolingRegistrationId: certificationCandidate.organizationLearnerId,
        };
      },
      attributes: [
        'firstName',
        'lastName',
        'birthdate',
        'birthProvinceCode',
        'birthCity',
        'birthCountry',
        'email',
        'resultRecipientEmail',
        'externalId',
        'extraTimePercentage',
        'isLinked',
        'schoolingRegistrationId',
        'organizationLearnerId',
        'sex',
        'birthINSEECode',
        'birthPostalCode',
        'complementaryCertifications',
        'billingMode',
        'prepaymentCode',
      ],
    }).serialize(certificationCandidates);
  },

  async deserialize(json: $TSFixMe) {
    if (json.data.attributes.birthdate && !isValidDate(json.data.attributes.birthdate, 'YYYY-MM-DD')) {
      throw new WrongDateFormatError(
        "La date de naissance du candidate à la certification n'a pas un format valide du type JJ/MM/AAAA"
      );
    }

    delete json.data.attributes['is-linked'];

    const deserializer = new Deserializer({ keyForAttribute: 'camelCase' });
    const deserializedCandidate = await deserializer.deserialize(json);
    deserializedCandidate.birthINSEECode = deserializedCandidate.birthInseeCode;
    delete deserializedCandidate.birthInseeCode;

    if (!deserializedCandidate.organizationLearnerId) {
      deserializedCandidate.organizationLearnerId = deserializedCandidate.schoolingRegistrationId;
    }
    delete deserializedCandidate.schoolingRegistrationId;

    return new CertificationCandidate(deserializedCandidate);
  },
};
