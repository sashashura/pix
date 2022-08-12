// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, EMPTY_BLANK_AND_NULL, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'WrongDateF... Remove this comment to see the full error message
const { WrongDateFormatError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NO_EXAMINE... Remove this comment to see the full error message
const { NO_EXAMINER_COMMENT } = require('../../../../../lib/domain/models/CertificationReport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../../lib/domain/models/CertificationCourse');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    let jsonCertificationCourse: $TSFixMe;
    let certificationCourseObject: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      jsonCertificationCourse = {
        data: {
          type: 'certifications',
          id: 1,
          attributes: {
            'first-name': 'Freezer',
            'last-name': 'The all mighty',
            birthplace: 'Namek',
            birthdate: '1989-10-24',
            'delivered-at': '2020-10-24',
            'external-id': 'xenoverse2',
            'examiner-comment': 'Un signalement surveillant',
          },
        },
      };

      certificationCourseObject = new CertificationCourse({
        id: 1,
        firstName: 'Freezer',
        lastName: 'The all mighty',
        birthplace: 'Namek',
        birthdate: '1989-10-24',
        deliveredAt: '2020-10-24',
        externalId: 'xenoverse2',
        examinerComment: 'Un signalement surveillant',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a JSON API data into a Certification Course object', async function () {
      // when
      const result = await serializer.deserialize(jsonCertificationCourse);

      // then
      expect(result).to.deep.equal(certificationCourseObject);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error if date is in wrong format', function () {
      // given
      jsonCertificationCourse.data.attributes.birthdate = '2015-32-12';

      // when
      const promise = serializer.deserialize(jsonCertificationCourse);

      // then
      return promise.catch(() => {
        expect(promise).to.be.rejectedWith(WrongDateFormatError);
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    EMPTY_BLANK_AND_NULL.forEach(function (examinerComment) {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return no examiner comment if comment is "${examinerComment}"`, async function () {
        // given
        jsonCertificationCourse.data.attributes['examiner-comment'] = examinerComment;

        // when
        const result = await serializer.deserialize(jsonCertificationCourse);

        // then
        expect(result.examinerComment).to.equal(NO_EXAMINER_COMMENT);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return undefined if no examiner comment', async function () {
      // given
      jsonCertificationCourse.data.attributes['examiner-comment'] = undefined;

      // when
      const result = await serializer.deserialize(jsonCertificationCourse);

      // then
      expect(result.examinerComment).to.equal(undefined);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserializeCertificationCandidateModificationCommand', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error if date is in wrong format', function () {
      // given
      const payload = {
        data: {
          type: 'certifications',
          id: 1,
          attributes: {
            'first-name': 'Freezer',
            'last-name': 'The all mighty',
            birthplace: 'Namek',
            birthdate: '2015-32-12',
          },
        },
      };

      // when
      const promise = serializer.deserializeCertificationCandidateModificationCommand(payload);

      // then
      return promise.catch(() => {
        expect(promise).to.be.rejectedWith(WrongDateFormatError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should deserialize only modifiable fields', async function () {
      // given
      const payload = {
        data: {
          type: 'certifications',
          id: 1,
          attributes: {
            'first-name': 'Freezer',
            'last-name': 'The all mighty',
            birthplace: 'Namek',
            birthdate: '1989-10-24',
            unmodifiablefield: 'unmodifiable field',
            sex: 'm',
            'birth-country': 'FRANCE',
            'birth-insee-code': '99100',
            'birth-postal-code': '75001',
          },
        },
      };
      const certificationCourseId = 14;
      const userId = 16;

      // when

      const command = await serializer.deserializeCertificationCandidateModificationCommand(
        payload,
        certificationCourseId,
        userId
      );

      // then
      expect(command).to.deep.equal({
        firstName: 'Freezer',
        lastName: 'The all mighty',
        birthplace: 'Namek',
        birthdate: '1989-10-24',
        certificationCourseId: 14,
        userId: 16,
        sex: 'm',
        birthCountry: 'FRANCE',
        birthINSEECode: '99100',
        birthPostalCode: '75001',
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serializeFromCertificationCourse', function () {
    const jsonCertification = {
      data: {
        type: 'certifications',
        id: '1',
        attributes: {
          'first-name': 'Freezer',
          'last-name': 'The all mighty',
          birthplace: 'Namek',
          birthdate: '1989-10-24',
          sex: 'M',
          'external-id': 'xenoverse2',
          'birth-insee-code': '99100',
          'birth-postal-code': '75001',
          'birth-country': 'FRANCE',
        },
      },
    };

    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const certificationCourse = domainBuilder.buildCertificationCourse({
      id: 1,
      firstName: 'Freezer',
      lastName: 'The all mighty',
      birthplace: 'Namek',
      birthdate: '1989-10-24',
      sex: 'M',
      externalId: 'xenoverse2',
      birthINSEECode: '99100',
      birthPostalCode: '75001',
      birthCountry: 'FRANCE',
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should serialize', function () {
      // when
      const serializedCertification = serializer.serializeFromCertificationCourse(certificationCourse);
      // then
      expect(serializedCertification).to.deep.equal(jsonCertification);
    });
  });
});
