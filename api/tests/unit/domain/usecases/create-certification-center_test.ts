// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createCertificationCenter = require('../../../../lib/domain/usecases/create-certification-center');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | create-certification-center', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCertificationCenter', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save and return the certification center', async function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter();
      const certificationCenterRepository = { save: sinon.stub().returns(certificationCenter) };
      const complementaryCertificationHabilitationRepository = {};

      // when
      const createdCertificationCenter = await createCertificationCenter({
        certificationCenter,
        complementaryCertificationIds: [],
        certificationCenterRepository,
        complementaryCertificationHabilitationRepository,
      });

      // then
      expect(certificationCenterRepository.save).to.be.calledOnceWith(certificationCenter);
      expect(createdCertificationCenter).to.deepEqualInstance(certificationCenter);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the complementary certification habilitations', async function () {
      // given
      const certificationCenter = domainBuilder.buildCertificationCenter();
      const complementaryCertificationIds = ['1234', '4567'];
      const certificationCenterRepository = { save: sinon.stub().returns(certificationCenter) };
      const complementaryCertificationHabilitationRepository = {
        save: sinon.stub(),
      };

      // when
      await createCertificationCenter({
        certificationCenter,
        complementaryCertificationIds,
        certificationCenterRepository,
        complementaryCertificationHabilitationRepository,
      });

      // then
      expect(complementaryCertificationHabilitationRepository.save).to.be.calledTwice;
    });
  });
});
