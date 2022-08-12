// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, databaseBuilder, expect, knex } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError, AlreadyExistingEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenterMembership = require('../../../../lib/domain/models/CertificationCenterMembership');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipRepository = require('../../../../lib/infrastructure/repositories/certification-center-membership-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createCert... Remove this comment to see the full error message
const createCertificationCenterMembershipByEmail = require('../../../../lib/domain/usecases/create-certification-center-membership-by-email');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | create-certification-center-membership-by-email', function () {
  let certificationCenterId: $TSFixMe;
  let user;
  let email;

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('certification-center-memberships').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should throw UserNotFoundError if user's email does not exist", async function () {
    // given
    email = 'notExist@example.net';

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createCertificationCenterMembershipByEmail)({
      certificationCenterId,
      email,
      certificationCenterMembershipRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotFoundError);
    expect((error as $TSFixMe).message).to.equal(`User not found for email ${email}`);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw AlreadyExistingEntityError if certification center membership exist', async function () {
    // given
    certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
    user = databaseBuilder.factory.buildUser();
    databaseBuilder.factory.buildCertificationCenterMembership({ userId: user.id, certificationCenterId });
    await databaseBuilder.commit();

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(createCertificationCenterMembershipByEmail)({
      certificationCenterId,
      email: user.email,
      certificationCenterMembershipRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(AlreadyExistingEntityError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create and return certification center membership ', async function () {
    // given
    certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
    user = databaseBuilder.factory.buildUser();
    await databaseBuilder.commit();

    // when
    const certificationCenterMembership = await createCertificationCenterMembershipByEmail({
      certificationCenterId,
      email: user.email,
      certificationCenterMembershipRepository,
      userRepository,
    });

    // then
    expect(certificationCenterMembership).to.be.an.instanceOf(CertificationCenterMembership);
    expect(certificationCenterMembership.certificationCenter.id).to.equal(certificationCenterId);
    expect(certificationCenterMembership.user.id).to.equal(user.id);

    const certificationCenterMembershipDB = await knex('certification-center-memberships')
      .where({ id: certificationCenterMembership.id })
      .first();
    expect(certificationCenterMembershipDB).to.exist;
  });
});
