const { Serializer } = require('jsonapi-serializer');

module.exports = {

  serialize(prescriber) {
    console.log(prescriber.memberships);
    const a =  new Serializer('prescriber', {

      transform: (record) => {
        const memberships = record.memberships.map((membershipsAttributes) => {
          return {
            ...membershipsAttributes,
            organization: { ...membershipsAttributes.organization }
          };
        });
        const userOrgaSettings = { ...record.userOrgaSettings };
        const organization = { ...userOrgaSettings.currentOrganization, targetProfiles: [] };
        delete userOrgaSettings.currentOrganization;
        return {
          ...record,
          userOrgaSettings: {
            ...userOrgaSettings,
            organization
          },
          memberships
        };
      },

      attributes: [
        'firstName', 'lastName', 'pixOrgaTermsOfServiceAccepted',
        'memberships', 'userOrgaSettings'
      ],
      memberships: {
        ref: 'id',
        attributes: ['organizationRole', 'organization'],
        organization: {
          ref: 'id',
          attributes: ['name', 'type', 'externalId', 'areNewYearStudentsImported', 'isManagingStudents', 'canCollectProfiles'],
        },
      },
      userOrgaSettings: {
        ref: 'id',
        attributes: ['id', 'organization'],
        organization: {
          ref: 'id',
          attributes: ['name', 'type', 'areNewYearStudentsImported', 'isManagingStudents', 'canCollectProfiles', 'externalId', 'targetProfiles', 'memberships', 'students', 'organizationInvitations'],
          memberships: {
            ref: 'id',
            ignoreRelationshipData: true,
            relationshipLinks: {
              related: function(record, current, parent) {
                return `/api/organizations/${parent.id}/memberships`;
              }
            }
          },
          organizationInvitations: {
            ref: 'id',
            ignoreRelationshipData: true,
            relationshipLinks: {
              related: function(record, current, parent) {
                return `/api/organizations/${parent.id}/invitations`;
              }
            }
          },
          students: {
            ref: 'id',
            ignoreRelationshipData: true,
            relationshipLinks: {
              related: function(record, current, parent) {
                return `/api/organizations/${parent.id}/students`;
              }
            }
          },
          targetProfiles: {
            ref: 'id',
            ignoreRelationshipData: true,
            relationshipLinks: {
              related: function(record, current, parent) {
                return `/api/organizations/${parent.id}/target-profiles`;
              }
            }
          },
        }
      },
    }).serialize(prescriber);

    return a;
  },
};

