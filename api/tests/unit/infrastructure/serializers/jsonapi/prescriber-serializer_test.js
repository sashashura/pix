const { expect, domainBuilder } = require('../../../../test-helper');

const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/prescriber-serializer');
const Membership = require('../../../../../lib/domain/models/Membership');

describe('Unit | Serializer | JSONAPI | prescriber-serializer', () => {

  describe.only('#serialize', () => {

    let organization;
    let user;
    let membership;
    let userOrgaSettings;
    let serializedPrescriber;

    beforeEach(() => {
      organization = domainBuilder.buildOrganization();
      user = domainBuilder.buildUser({
        pixOrgaTermsOfServiceAccepted: true,
        memberships: [],
        certificationCenterMemberships: [],
      });

      membership = domainBuilder.buildMembership({
        organization,
        organizationRole: Membership.roles.MEMBER,
        user
      });

      user.memberships.push(membership);
      organization.memberships.push(membership);

      userOrgaSettings = domainBuilder.buildUserOrgaSettings({
        currentOrganization: organization,
      });
      delete userOrgaSettings.user;

      serializedPrescriber = {
        'included': [{
          'type': 'organizations',
          'id': organization.id.toString(),
          'attributes': {
            'name': organization.name,
            'type': organization.type,
            'is-managing-students': organization.isManagingStudents,
            'can-collect-profiles': organization.canCollectProfiles,
            'external-id': organization.externalId,
            'are-new-year-students-imported': organization.areNewYearStudentsImported
          },
          'relationships': {
            'target-profiles': {
              'links': {
                'related': `/api/organizations/${organization.id}/target-profiles`
              }
            },
            'memberships': {
              'links': {
                'related': `/api/organizations/${organization.id}/memberships`
              }
            },
            'students': {
              'links': {
                'related': `/api/organizations/${organization.id}/students`
              }
            },
            'organization-invitations': {
              'links': {
                'related': `/api/organizations/${organization.id}/invitations`
              }
            }
          }
        },
        {
          'type': 'memberships',
          'id': membership.id.toString(),
          'attributes': {
            'organization-role': membership.organizationRole
          },
          'relationships': {
            'organization': {
              'data': {
                'type': 'organizations',
                'id': organization.id.toString()
              }
            }
          }
        },
        {
          'type': 'userOrgaSettings',
          'id': userOrgaSettings.id.toString(),
          'attributes': {
            id: userOrgaSettings.id,
          },
          'relationships': {
            'organization': {
              'data': {
                'type': 'organizations',
                'id': organization.id.toString()
              }
            }
          }
        }],
        'data': {
          'type': 'prescribers',
          'id': user.id.toString(),
          'attributes': {
            'first-name': user.firstName,
            'last-name': user.lastName,
            'pix-orga-terms-of-service-accepted': user.pixOrgaTermsOfServiceAccepted
          },
          'relationships': {
            'memberships': {
              'data': [{
                'type': 'memberships',
                'id': membership.id.toString()
              }]
            },
            'user-orga-settings': {
              'data': {
                'type': 'userOrgaSettings',
                'id': userOrgaSettings.id.toString()
              }
            }
          }
        }
      };
    });

    it('should return a JSON API serialized prescriber', () => {
      // given
      const prescriber = domainBuilder.buildPrescriber({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        pixOrgaTermsOfServiceAccepted: user.pixOrgaTermsOfServiceAccepted,
        memberships: [membership],
        userOrgaSettings
      });

      // when
      const result = serializer.serialize(prescriber);

      console.log('result', result.included)
      console.log('serializedPrescriber', serializedPrescriber.included)
      // then
      expect(result.included).to.deep.equal(serializedPrescriber.included);
    });
  });

});
