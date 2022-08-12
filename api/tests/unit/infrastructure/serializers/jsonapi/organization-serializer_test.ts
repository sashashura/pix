// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/organization-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../../lib/domain/models/Tag');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | organization-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a JSON API serialized organization', function () {
      // given
      const tags = [
        domainBuilder.buildTag({ id: 7, name: 'AEFE' }),
        domainBuilder.buildTag({ id: 44, name: 'PUBLIC' }),
      ];
      const organization = domainBuilder.buildOrganization({
        email: 'sco.generic.account@example.net',
        tags,
        createdBy: 10,
        documentationUrl: 'https://pix.fr/',
      });
      const meta = { some: 'meta' };

      // when
      const serializedOrganization = serializer.serialize(organization, meta);

      // then
      expect(serializedOrganization).to.deep.equal({
        data: {
          type: 'organizations',
          id: organization.id.toString(),
          attributes: {
            name: organization.name,
            type: organization.type,
            'logo-url': organization.logoUrl,
            'external-id': organization.externalId,
            'province-code': organization.provinceCode,
            'is-managing-students': organization.isManagingStudents,
            credit: organization.credit,
            email: organization.email,
            'created-by': organization.createdBy,
            'documentation-url': organization.documentationUrl,
            'show-nps': organization.showNPS,
            'form-nps-url': organization.formNPSUrl,
            'show-skills': organization.showSkills,
          },
          relationships: {
            memberships: {
              links: {
                related: `/api/organizations/${organization.id}/memberships`,
              },
            },
            students: {
              links: {
                related: `/api/organizations/${organization.id}/students`,
              },
            },
            'target-profiles': {
              links: {
                related: `/api/organizations/${organization.id}/target-profiles`,
              },
            },
            tags: {
              data: [
                {
                  id: tags[0].id.toString(),
                  type: 'tags',
                },
                {
                  id: tags[1].id.toString(),
                  type: 'tags',
                },
              ],
            },
          },
        },
        included: [
          {
            attributes: {
              id: tags[0].id,
              name: tags[0].name,
            },
            id: tags[0].id.toString(),
            type: 'tags',
          },
          {
            attributes: {
              id: tags[1].id,
              name: tags[1].name,
            },
            id: tags[1].id.toString(),
            type: 'tags',
          },
        ],
        meta: {
          some: 'meta',
        },
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include serialized student data when organization has organizationLearner', function () {
      // given
      const organization = domainBuilder.buildOrganization.withOrganizationLearners();

      // when
      const serializedOrganization = serializer.serialize(organization);

      // then
      expect(serializedOrganization.data.relationships.students).to.be.ok;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data to a Organization', function () {
      // given
      const organizationAttributes = {
        name: 'Lycée St Cricq',
        type: Organization.types.SCO,
        email: 'saint-cricq@example.net',
        credit: 0,
        logoUrl: null,
        externalId: 'ABCD123',
        provinceCode: '64',
        isManagingStudents: true,
        createdBy: 10,
        documentationUrl: 'https://pix.fr/',
        showSkills: false,
      };
      const jsonApiOrganization = {
        data: {
          type: 'organizations',
          id: '7',
          attributes: {
            name: organizationAttributes.name,
            type: organizationAttributes.type,
            email: organizationAttributes.email,
            credit: organizationAttributes.credit,
            'logo-url': organizationAttributes.logoUrl,
            'external-id': organizationAttributes.externalId,
            'province-code': organizationAttributes.provinceCode,
            'is-managing-students': organizationAttributes.isManagingStudents,
            'created-by': organizationAttributes.createdBy,
            'documentation-url': organizationAttributes.documentationUrl,
            'show-skills': organizationAttributes.showSkills,
          },
        },
      };

      // when
      const organization = serializer.deserialize(jsonApiOrganization);

      // then
      const expectedOrganization = new Organization({
        id: 7,
        name: organizationAttributes.name,
        type: organizationAttributes.type,
        email: organizationAttributes.email,
        credit: organizationAttributes.credit,
        logoUrl: organizationAttributes.logoUrl,
        externalId: organizationAttributes.externalId,
        provinceCode: organizationAttributes.provinceCode,
        isManagingStudents: organizationAttributes.isManagingStudents,
        createdBy: organizationAttributes.createdBy,
        documentationUrl: organizationAttributes.documentationUrl,
        showSkills: organizationAttributes.showSkills,
      });
      expect(organization).to.be.instanceOf(Organization);
      expect(organization).to.deep.equal(expectedOrganization);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should deserialize tags if there are some', function () {
      // given
      const organizationAttributes = {
        name: 'Lycée St Cricq',
        type: Organization.types.SCO,
        email: 'saint-cricq@example.net',
        credit: 0,
        logoUrl: null,
        externalId: 'ABCD123',
        provinceCode: '64',
        isManagingStudents: true,
      };
      const tagAttributes1 = { id: '4', type: 'tags' };
      const tagAttributes2 = { id: '2', type: 'tags' };
      const jsonApiOrganization = {
        data: {
          type: 'organizations',
          id: '7',
          attributes: {
            name: organizationAttributes.name,
            type: organizationAttributes.type,
            email: organizationAttributes.email,
            credit: organizationAttributes.credit,
            logoUrl: organizationAttributes.logoUrl,
            'external-id': organizationAttributes.externalId,
            'province-code': organizationAttributes.provinceCode,
            'is-managing-students': organizationAttributes.isManagingStudents,
          },
          relationships: {
            tags: {
              data: [tagAttributes1, tagAttributes2],
            },
          },
        },
      };

      // when
      const organization = serializer.deserialize(jsonApiOrganization);

      // then
      const expectedTag1 = new Tag({ id: parseInt(tagAttributes1.id) });
      const expectedTag2 = new Tag({ id: parseInt(tagAttributes2.id) });
      expect(organization.tags[0]).to.be.instanceOf(Tag);
      expect(organization.tags[0]).to.deep.equal(expectedTag1);
      expect(organization.tags[1]).to.deep.equal(expectedTag2);
    });
  });
});
