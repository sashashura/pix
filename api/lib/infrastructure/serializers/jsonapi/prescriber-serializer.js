const { Serializer } = require('jsonapi-serializer');

module.exports = {

  serialize(prescriber) {
    return new Serializer('prescriber', {

      transform: (record) => {
        record.userOrgaSettings.organization = { ...record.userOrgaSettings.currentOrganization };
        record.userOrgaSettings.organization.targetProfiles = [];
        record.userOrgaSettings.organization.memberships = [];
        record.userOrgaSettings.organization.students = [];
        record.userOrgaSettings.organization.organizationInvitations = [];

        record.memberships.forEach((membership) => {
          membership.organization = { ...membership.organization };
        });

        return record;
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
          attributes: ['name', 'externalId', 'areNewYearStudentsImported', 'isManagingStudents', 'canCollectProfiles'],
        },
      },
      userOrgaSettings: {
        ref: 'id',
        attributes: ['organization', 'user'],
        organization: {
          ref: 'id',
          attributes: ['name', 'type', 'targetProfiles', 'memberships', 'students', 'organizationInvitations'],
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
