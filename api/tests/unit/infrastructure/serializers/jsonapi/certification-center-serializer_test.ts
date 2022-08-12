// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-center-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-center-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Certification Center model object into JSON API data', function () {
      // given
      const complementaryCertification = domainBuilder.buildComplementaryCertification({
        id: 1,
        label: 'Pix+surf',
        key: 'SURF',
      });
      const certificationCenter = domainBuilder.buildCertificationCenter({
        id: 12,
        name: 'Centre des dés',
        type: 'SCO',
        createdAt: new Date('2018-01-01T05:43:10Z'),
        externalId: '12345',
        isSupervisorAccessEnabled: true,
        habilitations: [complementaryCertification],
      });

      const expectedSerializedCertificationCenter = {
        data: {
          type: 'certification-centers',
          id: '12',
          attributes: {
            name: 'Centre des dés',
            type: 'SCO',
            'external-id': '12345',
            'is-supervisor-access-enabled': true,
            'created-at': new Date('2018-01-01T05:43:10Z'),
          },
          relationships: {
            'certification-center-memberships': {
              links: {
                related: `/api/certification-centers/${certificationCenter.id}/certification-center-memberships`,
              },
            },
            habilitations: {
              data: [
                {
                  id: '1',
                  type: 'habilitations',
                },
              ],
            },
          },
        },
        included: [
          {
            id: '1',
            type: 'habilitations',
            attributes: {
              key: 'SURF',
              label: 'Pix+surf',
            },
          },
        ],
      };

      // when
      const serializedCertificationCenter = serializer.serialize(certificationCenter);

      // then
      expect(serializedCertificationCenter).to.deep.equal(expectedSerializedCertificationCenter);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API certification center data into a Certification Center model object', function () {
      // given
      const jsonApi = {
        data: {
          type: 'certification-centers',
          id: '123',
          attributes: {
            name: 'Centre des dés',
            type: 'SCO',
            'external-id': '12345',
            'is-supervisor-access-enabled': true,
            'created-at': new Date('2018-02-01T01:02:03Z'),
          },
          relationships: {},
        },
      };
      const expectedCertificationCenter = domainBuilder.buildCertificationCenter({
        id: '123',
        name: 'Centre des dés',
        type: 'SCO',
        externalId: '12345',
        createdAt: null,
        isSupervisorAccessEnabled: true,
        habilitations: [],
      });

      // when
      const deserializedCertificationCenter = serializer.deserialize(jsonApi);

      // then
      expect(deserializedCertificationCenter).to.deepEqualInstance(expectedCertificationCenter);
    });
  });
});
