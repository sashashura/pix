// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'WrongDateF... Remove this comment to see the full error message
const { WrongDateFormatError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NO_EXAMINE... Remove this comment to see the full error message
const { NO_EXAMINER_COMMENT } = require('../../../domain/models/CertificationReport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
const { isValidDate } = require('../../utils/date-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../domain/models/CertificationCourse');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeFromCertificationCourse(certificationCourse: $TSFixMe) {
    return new Serializer('certifications', {
      transform: (certificationCourse: $TSFixMe) => {
        return {
          ..._.omit(certificationCourse.toDTO(), 'maxReachableLevelOnCertificationDate'),
        };
      },
      attributes: [
        'firstName',
        'lastName',
        'birthplace',
        'birthdate',
        'sex',
        'externalId',
        'maxReachableLevelOnCertificationDate',
        'birthINSEECode',
        'birthPostalCode',
        'birthCountry',
      ],
    }).serialize(certificationCourse);
  },
  async deserializeCertificationCandidateModificationCommand(json: $TSFixMe, certificationCourseId: $TSFixMe, userId: $TSFixMe) {
    const deserializer = new Deserializer({ keyForAttribute: 'camelCase' });
    const deserializedRawCommand = await deserializer.deserialize(json);
    if (deserializedRawCommand.birthdate) {
      if (!isValidDate(deserializedRawCommand.birthdate, 'YYYY-MM-DD')) {
        throw new WrongDateFormatError();
      }
    }
    return {
      ..._.pick(deserializedRawCommand, [
        'firstName',
        'lastName',
        'birthplace',
        'birthdate',
        'birthCountry',
        'birthPostalCode',
        'sex',
      ]),
      birthINSEECode: deserializedRawCommand.birthInseeCode,
      userId,
      certificationCourseId,
    };
  },
  deserialize(json: $TSFixMe) {
    const birthdate = json.data.attributes.birthdate;

    return new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(json).then((certification: $TSFixMe) => {
      if (birthdate) {
        if (!isValidDate(birthdate, 'YYYY-MM-DD')) {
          return Promise.reject(new WrongDateFormatError());
        }
      }

      const certificationDomainModel = new CertificationCourse(certification);

      if (!_isOmitted(certification.examinerComment) && _hasNoExaminerComment(certification.examinerComment)) {
        (certificationDomainModel as $TSFixMe).examinerComment = NO_EXAMINER_COMMENT;
      }
      return certificationDomainModel;
    });
  },
};

function _isOmitted(aString: $TSFixMe) {
  return _.isUndefined(aString);
}

function _hasNoExaminerComment(aString: $TSFixMe) {
  return _.isEmpty(_.trim(aString));
}
