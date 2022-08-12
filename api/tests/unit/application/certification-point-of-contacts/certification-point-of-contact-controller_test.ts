// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationPointOfContactController = require('../../../../lib/application/certification-point-of-contacts/certification-point-of-contact-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | certifications-point-of-contact-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getCertificationPointOfContact');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized CertificationPointOfContact', async function () {
      // given
      const allowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
        id: 123,
        name: 'Sunnydale Center',
        externalId: 'BUFFY_SLAYER',
        type: 'PRO',
        isRelatedToManagingStudentsOrganization: false,
        relatedOrganizationTags: [],
      });
      const certificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
        id: 789,
        firstName: 'Buffy',
        lastName: 'Summers',
        email: 'buffy.summers@example.net',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [allowedCertificationCenterAccess],
      });
      const request = {
        auth: {
          credentials: { userId: 123 },
        },
      };
      usecases.getCertificationPointOfContact.withArgs({ userId: 123 }).resolves(certificationPointOfContact);

      // when
      const response = await certificationPointOfContactController.get(request, hFake);

      // then
      expect(response).to.deep.equal({
        data: {
          id: '789',
          type: 'certification-point-of-contact',
          attributes: {
            'first-name': 'Buffy',
            'last-name': 'Summers',
            email: 'buffy.summers@example.net',
            'pix-certif-terms-of-service-accepted': true,
          },
          relationships: {
            'allowed-certification-center-accesses': {
              data: [
                {
                  id: '123',
                  type: 'allowed-certification-center-access',
                },
              ],
            },
          },
        },
        included: [
          {
            id: '123',
            type: 'allowed-certification-center-access',
            attributes: {
              name: 'Sunnydale Center',
              'external-id': 'BUFFY_SLAYER',
              type: 'PRO',
              'is-access-blocked-college': false,
              'is-access-blocked-lycee': false,
              'is-access-blocked-aefe': false,
              'is-access-blocked-agri': false,
              'is-related-to-managing-students-organization': false,
              'pix-certif-sco-blocked-access-date-college': null,
              'pix-certif-sco-blocked-access-date-lycee': null,
              'related-organization-tags': [],
              habilitations: [],
              'is-end-test-screen-removal-enabled': false,
            },
          },
        ],
      });
    });
  });
});
