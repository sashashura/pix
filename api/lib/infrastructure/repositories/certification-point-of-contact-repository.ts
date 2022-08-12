// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationPointOfContact = require('../../domain/read-models/CertificationPointOfContact');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AllowedCer... Remove this comment to see the full error message
const AllowedCertificationCenterAccess = require('../../domain/read-models/AllowedCertificationCenterAccess');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(userId: $TSFixMe) {
    const certificationPointOfContactDTO = await knex
      .select({
        id: 'users.id',
        firstName: 'users.firstName',
        lastName: 'users.lastName',
        email: 'users.email',
        pixCertifTermsOfServiceAccepted: 'users.pixCertifTermsOfServiceAccepted',
        certificationCenterIds: knex.raw('array_agg(?? order by ?? asc)', [
          'certificationCenterId',
          'certificationCenterId',
        ]),
      })
      .from('users')
      .leftJoin('certification-center-memberships', 'certification-center-memberships.userId', 'users.id')
      .where('users.id', userId)
      .groupByRaw('1, 2, 3, 4, 5')
      .first();

    if (!certificationPointOfContactDTO) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Le référent de certification ${userId} n'existe pas.`);
    }

    const authorizedCertificationCenterIds = await _removeDisabledCertificationCenterAccesses({
      certificationPointOfContactDTO,
    });
    const allowedCertificationCenterAccesses = await _findAllowedCertificationCenterAccesses(
      authorizedCertificationCenterIds
    );

    return new CertificationPointOfContact({
      ...certificationPointOfContactDTO,
      allowedCertificationCenterAccesses,
    });
  },
};

async function _removeDisabledCertificationCenterAccesses({
  certificationPointOfContactDTO
}: $TSFixMe) {
  const certificationCenters = await knex
    .select('certificationCenterId')
    .from('certification-center-memberships')
    .where('certification-center-memberships.userId', certificationPointOfContactDTO.id)
    .whereIn(
      'certification-center-memberships.certificationCenterId',
      certificationPointOfContactDTO.certificationCenterIds
    )
    .where('certification-center-memberships.disabledAt', null);

  const certificationCenterIds = _.chain(certificationCenters)
    .map((certificationCenter: $TSFixMe) => certificationCenter.certificationCenterId)
    .compact()
    .value();
  return certificationCenterIds;
}

async function _findAllowedCertificationCenterAccesses(certificationCenterIds: $TSFixMe) {
  const allowedCertificationCenterAccessDTOs = await knex
    .select({
      id: 'certification-centers.id',
      name: 'certification-centers.name',
      externalId: 'certification-centers.externalId',
      type: 'certification-centers.type',
      isRelatedToManagingStudentsOrganization: 'organizations.isManagingStudents',
      isSupervisorAccessEnabled: 'certification-centers.isSupervisorAccessEnabled',
      tags: knex.raw('array_agg(?? order by ??)', ['tags.name', 'tags.name']),
      habilitations: knex.raw(
        `array_agg(json_build_object('id', "complementary-certifications".id, 'label', "complementary-certifications".label, 'key', "complementary-certifications".key) order by "complementary-certifications".id)`
      ),
    })
    .from('certification-centers')
    .leftJoin('organizations', function(this: $TSFixMe) {
      this.on('organizations.externalId', 'certification-centers.externalId').andOn(
        'organizations.type',
        'certification-centers.type'
      );
    })
    .leftJoin('organization-tags', 'organization-tags.organizationId', 'organizations.id')
    .leftJoin('tags', 'tags.id', 'organization-tags.tagId')
    .leftJoin(
      'complementary-certification-habilitations',
      'complementary-certification-habilitations.certificationCenterId',
      'certification-centers.id'
    )
    .leftJoin(
      'complementary-certifications',
      'complementary-certifications.id',
      'complementary-certification-habilitations.complementaryCertificationId'
    )
    .whereIn('certification-centers.id', certificationCenterIds)
    .orderBy('certification-centers.id')
    .groupByRaw('1, 2, 3, 4, 5, 6');

  return _.map(allowedCertificationCenterAccessDTOs, (allowedCertificationCenterAccessDTO: $TSFixMe) => {
    return new AllowedCertificationCenterAccess({
      ...allowedCertificationCenterAccessDTO,
      isRelatedToManagingStudentsOrganization: Boolean(
        allowedCertificationCenterAccessDTO.isRelatedToManagingStudentsOrganization
      ),
      relatedOrganizationTags: _cleanTags(allowedCertificationCenterAccessDTO),
      habilitations: _cleanHabilitations(allowedCertificationCenterAccessDTO),
    });
  });

  function _cleanTags(allowedCertificationCenterAccessDTO: $TSFixMe) {
    return _(allowedCertificationCenterAccessDTO.tags).compact().uniq().value();
  }

  function _cleanHabilitations(allowedCertificationCenterAccessDTO: $TSFixMe) {
    return _(allowedCertificationCenterAccessDTO.habilitations)
      .filter((habilitation: $TSFixMe) => Boolean(habilitation.id))
      .uniqBy('id')
      .value();
  }
}
