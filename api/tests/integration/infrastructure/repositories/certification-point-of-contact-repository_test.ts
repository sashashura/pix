// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../../../lib/domain/models/CertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationPointOfContactRepository = require('../../../../lib/infrastructure/repositories/certification-point-of-contact-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | CertificationPointOfContact', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw NotFoundError when point of contact does not exist', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(certificationPointOfContactRepository.get)(123);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect((error as $TSFixMe).message).to.equal("Le référent de certification 123 n'existe pas.");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a CertificationPointOfContact', async function () {
      // given
      databaseBuilder.factory.buildUser({
        id: 456,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
      });
      databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      const certificationPointOfContact = await certificationPointOfContactRepository.get(456);

      // then
      const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
        id: 456,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [],
      });
      expect(expectedCertificationPointOfContact).to.deepEqualInstance(certificationPointOfContact);
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the certification center is related to an organization of the same type that manages students',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return CertificationPointOfContact with isRelatedOrganizationManagingStudents as true', async function () {
          // given
databaseBuilder.factory.buildCertificationCenter({
    id: 123,
    name: 'Centre des papys gâteux',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    externalId: 'ABC123',
});
          databaseBuilder.factory.buildOrganization({
            id: 222,
            externalId: 'ABC123',
            isManagingStudents: false,
            type: Organization.types.SUP,
          });
          databaseBuilder.factory.buildOrganization({
            id: 753,
            externalId: 'ABC123',
            isManagingStudents: true,
            type: Organization.types.PRO,
          });
          databaseBuilder.factory.buildUser({
            id: 456,
            firstName: 'Jean',
            lastName: 'Acajou',
            email: 'jean.acajou@example.net',
            pixCertifTermsOfServiceAccepted: true,
          });
          databaseBuilder.factory.buildCertificationCenterMembership({
            certificationCenterId: 123,
            userId: 456,
          });
          await databaseBuilder.commit();

          // when
          const certificationPointOfContact = await certificationPointOfContactRepository.get(456);

          // then
const expectedAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
    id: 123,
    name: 'Centre des papys gâteux',
    externalId: 'ABC123',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    isRelatedToManagingStudentsOrganization: true,
    relatedOrganizationTags: [],
    habilitations: [],
});
          const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
            id: 456,
            firstName: 'Jean',
            lastName: 'Acajou',
            email: 'jean.acajou@example.net',
            pixCertifTermsOfServiceAccepted: true,
            allowedCertificationCenterAccesses: [expectedAllowedCertificationCenterAccess],
          });
          expect(expectedCertificationPointOfContact).to.deepEqualInstance(certificationPointOfContact);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is linked to many certification centers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return actives and allowed certification center accesses of the CertificationPointOfContact', async function () {
        // given
        const now = new Date();
        databaseBuilder.factory.buildCertificationCenter({
    id: 1,
    name: 'Centre de certif sans orga reliée',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    externalId: 'Centre1',
});
        databaseBuilder.factory.buildCertificationCenter({
    id: 2,
    name: 'Centre de certif reliée à une orga sans tags',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    externalId: 'Centre2',
});
        databaseBuilder.factory.buildOrganization({
          externalId: 'Centre2',
          isManagingStudents: true,
          type: Organization.types.PRO,
        });
        databaseBuilder.factory.buildCertificationCenter({
    id: 3,
    name: 'Centre de certif reliée à une orga avec 1 tag',
    type: (CertificationCenter as $TSFixMe).types.SUP,
    externalId: 'Centre3',
});
        databaseBuilder.factory.buildOrganization({
          id: 3,
          externalId: 'Centre3',
          isManagingStudents: false,
          type: Organization.types.SUP,
        });
        databaseBuilder.factory.buildTag({ id: 3, name: 'premier tag' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId: 3, tagId: 3 });
        databaseBuilder.factory.buildCertificationCenter({
    id: 4,
    name: 'Centre de certif reliée à une orga avec 2 tags',
    type: (CertificationCenter as $TSFixMe).types.SCO,
    externalId: 'Centre4',
});
        databaseBuilder.factory.buildOrganization({
          id: 4,
          externalId: 'Centre4',
          isManagingStudents: false,
          type: Organization.types.SCO,
        });
        databaseBuilder.factory.buildTag({ id: 4, name: 'deuxieme tag' });
        databaseBuilder.factory.buildTag({ id: 5, name: 'troisieme tag' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId: 4, tagId: 4 });
        databaseBuilder.factory.buildOrganizationTag({ organizationId: 4, tagId: 5 });
        databaseBuilder.factory.buildUser({
          id: 123,
          firstName: 'Jean',
          lastName: 'Acajou',
          email: 'jean.acajou@example.net',
          pixCertifTermsOfServiceAccepted: true,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 1,
          userId: 123,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 2,
          userId: 123,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 3,
          userId: 123,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 4,
          userId: 123,
          disabledAt: now,
        });
        await databaseBuilder.commit();

        // when
        const certificationPointOfContact = await certificationPointOfContactRepository.get(123);

        // then
const expectedFirstAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
    id: 1,
    name: 'Centre de certif sans orga reliée',
    externalId: 'Centre1',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    isRelatedToManagingStudentsOrganization: false,
    relatedOrganizationTags: [],
    habilitations: [],
});
        const expectedSecondAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
    id: 2,
    name: 'Centre de certif reliée à une orga sans tags',
    externalId: 'Centre2',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    isRelatedToManagingStudentsOrganization: true,
    relatedOrganizationTags: [],
    habilitations: [],
});
        const expectedThirdAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
    id: 3,
    name: 'Centre de certif reliée à une orga avec 1 tag',
    externalId: 'Centre3',
    type: (CertificationCenter as $TSFixMe).types.SUP,
    isRelatedToManagingStudentsOrganization: false,
    relatedOrganizationTags: ['premier tag'],
    habilitations: [],
});
        const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
          id: 123,
          firstName: 'Jean',
          lastName: 'Acajou',
          email: 'jean.acajou@example.net',
          pixCertifTermsOfServiceAccepted: true,
          allowedCertificationCenterAccesses: [
            expectedFirstAllowedCertificationCenterAccess,
            expectedSecondAllowedCertificationCenterAccess,
            expectedThirdAllowedCertificationCenterAccess,
          ],
        });
        expect(expectedCertificationPointOfContact).to.deepEqualInstance(certificationPointOfContact);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all the certification center habilitations', async function () {
      // given
      databaseBuilder.factory.buildComplementaryCertification({ id: 1, label: 'Certif comp 1', key: 'COMP_1' });
      databaseBuilder.factory.buildComplementaryCertification({ id: 2, label: 'Certif comp 2', key: 'COMP_2' });
      databaseBuilder.factory.buildComplementaryCertification({ id: 3, label: 'Certif comp 3', key: 'COMP_3' });
      databaseBuilder.factory.buildCertificationCenter({
    id: 1,
    name: 'Centre de certif sans orga reliée',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    externalId: 'Centre1',
});
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId: 1,
        complementaryCertificationId: 1,
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId: 1,
        complementaryCertificationId: 2,
      });
      databaseBuilder.factory.buildCertificationCenter({
    id: 2,
    name: 'Centre de certif reliée à une orga sans tags',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    externalId: 'Centre2',
});
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId: 2,
        complementaryCertificationId: 3,
      });
      databaseBuilder.factory.buildUser({
        id: 123,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
      });
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: 1,
        userId: 123,
      });
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: 2,
        userId: 123,
      });
      await databaseBuilder.commit();

      // when
      const certificationPointOfContact = await certificationPointOfContactRepository.get(123);

      // then
const expectedFirstAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
    id: 1,
    name: 'Centre de certif sans orga reliée',
    externalId: 'Centre1',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    isRelatedToManagingStudentsOrganization: false,
    relatedOrganizationTags: [],
    habilitations: [
        { id: 1, label: 'Certif comp 1', key: 'COMP_1' },
        { id: 2, label: 'Certif comp 2', key: 'COMP_2' },
    ],
});
      const expectedSecondAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
    id: 2,
    name: 'Centre de certif reliée à une orga sans tags',
    externalId: 'Centre2',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    isRelatedToManagingStudentsOrganization: false,
    relatedOrganizationTags: [],
    habilitations: [{ id: 3, label: 'Certif comp 3', key: 'COMP_3' }],
});
      const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
        id: 123,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [
          expectedFirstAllowedCertificationCenterAccess,
          expectedSecondAllowedCertificationCenterAccess,
        ],
      });
      expect(certificationPointOfContact).to.deepEqualInstance(expectedCertificationPointOfContact);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when user is linked to a certification center that has habilitations and is associated with an organization with tags',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the certification point of contact with tags and habilitations', async function () {
          // given
          databaseBuilder.factory.buildComplementaryCertification({ id: 1, label: 'Certif comp 1', key: 'COMP_1' });
          databaseBuilder.factory.buildComplementaryCertification({ id: 2, label: 'Certif comp 2', key: 'COMP_2' });
          databaseBuilder.factory.buildCertificationCenter({
    id: 1,
    name: 'Centre de certif',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    externalId: 'Centre1',
});
          databaseBuilder.factory.buildComplementaryCertificationHabilitation({
            certificationCenterId: 1,
            complementaryCertificationId: 1,
          });
          databaseBuilder.factory.buildComplementaryCertificationHabilitation({
            certificationCenterId: 1,
            complementaryCertificationId: 2,
          });
          databaseBuilder.factory.buildOrganization({
            id: 10,
            externalId: 'Centre1',
            isManagingStudents: false,
            type: Organization.types.PRO,
          });
          databaseBuilder.factory.buildTag({
            id: 66,
            name: 'tag1',
          });
          databaseBuilder.factory.buildTag({
            id: 67,
            name: 'tag2',
          });
          databaseBuilder.factory.buildOrganizationTag({
            organizationId: 10,
            tagId: 66,
          });
          databaseBuilder.factory.buildOrganizationTag({
            organizationId: 10,
            tagId: 67,
          });
          databaseBuilder.factory.buildUser({
            id: 123,
            firstName: 'Jean',
            lastName: 'Acajou',
            email: 'jean.acajou@example.net',
            pixCertifTermsOfServiceAccepted: true,
          });
          databaseBuilder.factory.buildCertificationCenterMembership({
            certificationCenterId: 1,
            userId: 123,
          });
          await databaseBuilder.commit();

          // when
          const certificationPointOfContact = await certificationPointOfContactRepository.get(123);

          // then
const expectedAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
    id: 1,
    name: 'Centre de certif',
    externalId: 'Centre1',
    type: (CertificationCenter as $TSFixMe).types.PRO,
    isRelatedToManagingStudentsOrganization: false,
    relatedOrganizationTags: ['tag1', 'tag2'],
    habilitations: [
        { id: 1, label: 'Certif comp 1', key: 'COMP_1' },
        { id: 2, label: 'Certif comp 2', key: 'COMP_2' },
    ],
});
          const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
            id: 123,
            firstName: 'Jean',
            lastName: 'Acajou',
            email: 'jean.acajou@example.net',
            pixCertifTermsOfServiceAccepted: true,
            allowedCertificationCenterAccesses: [expectedAllowedCertificationCenterAccess],
          });
          expect(certificationPointOfContact).to.deepEqualInstance(expectedCertificationPointOfContact);
        });
      }
    );
  });
});
