const { Serializer } = require('jsonapi-serializer');

module.exports = {

  serialize(prescriber) {
    return new Serializer('prescriber', {

      transform: (record) => {
        const recordWithoutClass = { ...record };
        recordWithoutClass.userOrgaSettings = { ...recordWithoutClass.userOrgaSettings };
        recordWithoutClass.userOrgaSettings.organization = { ...recordWithoutClass.userOrgaSettings.currentOrganization };
        recordWithoutClass.userOrgaSettings.organization.targetProfiles = [];
        recordWithoutClass.userOrgaSettings.organization.memberships = [];
        recordWithoutClass.userOrgaSettings.organization.students = [];
        recordWithoutClass.userOrgaSettings.organization.organizationInvitations = [];

        delete recordWithoutClass.userOrgaSettings.currentOrganization;

        recordWithoutClass.memberships = recordWithoutClass.memberships.map((membership) => ({ ...membership }));
        recordWithoutClass.memberships.forEach((membership) => {
          membership.organization = { ...membership.organization, areNewYearStudentsImported: false };
        });

          console.log(recordWithoutClass)
        return recordWithoutClass;
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
          attributes: ['name', 'externalId'],
        },
      },
      userOrgaSettings: {
        ref: 'id',
        attributes: ['organization', 'user'],
        organization: {
          ref: 'id',
          attributes: ['name', 'type', 'areNewYearStudentsImported', 'isManagingStudents', 'canCollectProfiles', 'targetProfiles', 'memberships', 'students', 'organizationInvitations'],
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
        },
      },
    }).serialize(prescriber);
  },
};
