// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationOfficerRepository = require('../../../../lib/infrastructure/repositories/certification-officer-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationOfficer = require('../../../../lib/domain/models/CertificationOfficer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | CertificationOfficer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let userInDb: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userInDb = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the found certificationOfficer', async function () {
      // when
      const certificationOfficer = await certificationOfficerRepository.get(userInDb.id);

      // then
      expect(certificationOfficer).to.be.an.instanceOf(CertificationOfficer);
      expect(certificationOfficer.id).to.equal(userInDb.id);
      expect(certificationOfficer.firstName).to.equal(userInDb.firstName);
      expect(certificationOfficer.lastName).to.equal(userInDb.lastName);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a UserNotFoundError if no certificationOfficer is found', async function () {
      // given
      const nonExistentUserId = 678;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(certificationOfficerRepository.get)(nonExistentUserId);

      // then
      expect(result).to.be.instanceOf(UserNotFoundError);
    });
  });
});
