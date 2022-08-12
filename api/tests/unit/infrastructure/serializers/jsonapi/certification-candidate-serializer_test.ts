// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../../../lib/domain/models/CertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-candidate-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-candidate-serializer', function () {
  let certificationCandidate: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCandidate = domainBuilder.buildCertificationCandidate({
      organizationLearnerId: 1,
      billingMode: 'PAID',
      complementaryCertifications: [
        domainBuilder.buildComplementaryCertification({
          id: 2,
          label: 'Pix+Patisserie',
          key: 'PATISSERIE',
        }),
      ],
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a CertificationCandidate model object into JSON API data', function () {
      // given
      const expectedJsonApiData = {
        data: {
          type: 'certification-candidates',
          id: certificationCandidate.id.toString(),
          attributes: {
            'first-name': certificationCandidate.firstName,
            'last-name': certificationCandidate.lastName,
            'billing-mode': 'Payante',
            'prepayment-code': null,
            'birth-city': certificationCandidate.birthCity,
            'birth-province-code': certificationCandidate.birthProvinceCode,
            'birth-insee-code': certificationCandidate.birthINSEECode,
            'birth-postal-code': certificationCandidate.birthPostalCode,
            'birth-country': certificationCandidate.birthCountry,
            birthdate: certificationCandidate.birthdate,
            email: certificationCandidate.email,
            'result-recipient-email': certificationCandidate.resultRecipientEmail,
            'external-id': certificationCandidate.externalId,
            'extra-time-percentage': certificationCandidate.extraTimePercentage,
            'is-linked': !_.isNil(certificationCandidate.userId),
            'schooling-registration-id': 1,
            'organization-learner-id': 1,
            sex: certificationCandidate.sex,
            'complementary-certifications': [
              {
                id: 2,
                label: 'Pix+Patisserie',
                key: 'PATISSERIE',
              },
            ],
          },
        },
      };

      // when
      const jsonApi = serializer.serialize(certificationCandidate);

      // then
      expect(jsonApi).to.deep.equal(expectedJsonApiData);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into a CertificationCandidate model object', async function () {
      // given
      const jsonApiData = {
        data: {
          type: 'certification-candidates',
          id: certificationCandidate.id.toString(),
          attributes: {
            'first-name': certificationCandidate.firstName,
            'last-name': certificationCandidate.lastName,
            'birth-city': certificationCandidate.birthCity,
            'birth-province-code': certificationCandidate.birthProvinceCode,
            'birth-country': certificationCandidate.birthCountry,
            email: certificationCandidate.email,
            'result-recipient-email': certificationCandidate.resultRecipientEmail,
            birthdate: certificationCandidate.birthdate,
            'external-id': certificationCandidate.externalId,
            'extra-time-percentage': certificationCandidate.extraTimePercentage,
            'is-linked': !_.isNil(certificationCandidate.userId),
            'organization-learner-id': certificationCandidate.organizationLearnerId,
          },
        },
      };

      // when
      const deserializedCertificationCandidate = await serializer.deserialize(jsonApiData);

      // then
      expect(deserializedCertificationCandidate).to.be.instanceOf(CertificationCandidate);
      expect(deserializedCertificationCandidate.firstName).to.equal(certificationCandidate.firstName);
      expect(deserializedCertificationCandidate.lastName).to.equal(certificationCandidate.lastName);
      expect(deserializedCertificationCandidate.birthdate).to.equal(certificationCandidate.birthdate);
      expect(deserializedCertificationCandidate.birthProvinceCode).to.equal(certificationCandidate.birthProvinceCode);
      expect(deserializedCertificationCandidate.birthCity).to.equal(certificationCandidate.birthCity);
      expect(deserializedCertificationCandidate.birthCountry).to.equal(certificationCandidate.birthCountry);
      expect(deserializedCertificationCandidate.extraTimePercentage).to.equal(
        certificationCandidate.extraTimePercentage
      );
      expect(deserializedCertificationCandidate.externalId).to.equal(certificationCandidate.externalId);
      expect(deserializedCertificationCandidate.email).to.equal(certificationCandidate.email);
      expect(deserializedCertificationCandidate.resultRecipientEmail).to.equal(
        certificationCandidate.resultRecipientEmail
      );
      expect(deserializedCertificationCandidate.organizationLearnerId).to.equal(
        certificationCandidate.organizationLearnerId
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON deprecated schoolingRegistrationId to organizationLearnerId', async function () {
      // given
      const jsonApiData = {
        data: {
          type: 'certification-candidates',
          id: certificationCandidate.id.toString(),
          attributes: {
            'schooling-registration-id': certificationCandidate.organizationLearnerId,
          },
        },
      };

      // when
      const deserializedCertificationCandidate = await serializer.deserialize(jsonApiData);

      // then
      expect(deserializedCertificationCandidate.organizationLearnerId).to.equal(
        certificationCandidate.organizationLearnerId
      );
    });
  });
});
