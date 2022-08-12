// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getOrganizationLearnersCsvTemplate = require('../../../../lib/domain/usecases/get-organization-learners-csv-template');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-organization-learners-csv-template', function () {
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const userId = Symbol('userId');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const organizationId = Symbol('organizationId');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const membershipRepository = { findByUserIdAndOrganizationId: _.noop };
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const i18n = getI18n();

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is ADMIN in a SUP organization managing students', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return headers line', async function () {
      // given
      const organization = domainBuilder.buildOrganization({ isManagingStudents: true, type: 'SUP' });
      const membership = domainBuilder.buildMembership({ organizationRole: 'ADMIN', organization });
      sinon.stub(membershipRepository, 'findByUserIdAndOrganizationId').resolves([membership]);

      // when
      const result = await getOrganizationLearnersCsvTemplate({ userId, organizationId, i18n, membershipRepository });

      // then
      const csvExpected =
        '\uFEFF"Premier prénom";' +
        '"Deuxième prénom";' +
        '"Troisième prénom";' +
        '"Nom de famille";' +
        '"Nom d\'usage";' +
        '"Date de naissance (jj/mm/aaaa)";' +
        '"Email";' +
        '"Numéro étudiant";' +
        '"Composante";' +
        '"Équipe pédagogique";' +
        '"Groupe";' +
        '"Diplôme";' +
        '"Régime"\n';
      expect(result).to.deep.equal(csvExpected);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is ADMIN in a SUP organization not managing students', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      sinon
        .stub(membershipRepository, 'findByUserIdAndOrganizationId')
        .resolves([{ isAdmin: true, organization: { isManagingStudents: false, type: 'SUP' } }]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getOrganizationLearnersCsvTemplate)({
        userId,
        organizationId,
        membershipRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is not ADMIN in a SUP organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      sinon
        .stub(membershipRepository, 'findByUserIdAndOrganizationId')
        .resolves([{ isAdmin: false, organization: { isManagingStudents: true, type: 'SUP' } }]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getOrganizationLearnersCsvTemplate)({
        userId,
        organizationId,
        membershipRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is not a member of the organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      sinon.stub(membershipRepository, 'findByUserIdAndOrganizationId').resolves([]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getOrganizationLearnersCsvTemplate)({
        userId,
        organizationId,
        membershipRepository,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
