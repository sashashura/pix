// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateCertificationCenter = require('../../../../lib/domain/usecases/update-certification-center');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterCreationValidator = require('../../../../lib/domain/validators/certification-center-creation-validator');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-certification-center', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateCertificationCenter', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are no associated complementary certitification habilitation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the certification center', async function () {
        // given
        const certificationCenter = domainBuilder.buildCertificationCenter();
        const validatorStub = sinon.stub(certificationCenterCreationValidator, 'validate');
        const certificationCenterRepository = { save: sinon.stub().returns(certificationCenter) };
        const complementaryCertificationHabilitationRepository = {
          deleteByCertificationCenterId: sinon.stub(),
          save: sinon.stub().returns(certificationCenter),
        };

        // when
        const savedCertificationCenter = await updateCertificationCenter({
          certificationCenter,
          certificationCenterRepository,
          complementaryCertificationHabilitationRepository,
        });

        // then
        expect(validatorStub).to.be.calledOnceWith(certificationCenter);
        expect(certificationCenterRepository.save).to.be.calledOnceWith(certificationCenter);
        expect(savedCertificationCenter).to.equal(certificationCenter);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are associated habilitations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reset existing complementary certitification habilitation and create new ones', async function () {
        // given
        const certificationCenter = domainBuilder.buildCertificationCenter();
        const complementaryCertificationIds = ['1234', '5678'];
        const complementaryCertificationHabilitation1 = domainBuilder.buildComplementaryCertificationHabilitation({
          complementaryCertificationId: 1234,
          certificationCenterId: certificationCenter.id,
        });
        const complementaryCertificationHabilitation2 = domainBuilder.buildComplementaryCertificationHabilitation({
          complementaryCertificationId: 5678,
          certificationCenterId: certificationCenter.id,
        });
        complementaryCertificationHabilitation1.id = undefined;
        complementaryCertificationHabilitation2.id = undefined;
        const validatorStub = sinon.stub(certificationCenterCreationValidator, 'validate');
        const certificationCenterRepository = { save: sinon.stub().returns(certificationCenter) };
        const complementaryCertificationHabilitationRepository = {
          deleteByCertificationCenterId: sinon.stub(),
          save: sinon.stub(),
        };

        // when
        const savedCertificationCenter = await updateCertificationCenter({
          certificationCenter,
          complementaryCertificationIds,
          certificationCenterRepository,
          complementaryCertificationHabilitationRepository,
        });

        // then
        expect(validatorStub).to.be.calledOnceWith(certificationCenter);
        expect(certificationCenterRepository.save).to.be.calledOnceWith(certificationCenter);
        expect(complementaryCertificationHabilitationRepository.deleteByCertificationCenterId).to.be.calledOnceWith(
          certificationCenter.id
        );
        expect(complementaryCertificationHabilitationRepository.save).to.be.calledWith(
          complementaryCertificationHabilitation1
        );
        expect(complementaryCertificationHabilitationRepository.save).to.be.calledWith(
          complementaryCertificationHabilitation2
        );
        expect(savedCertificationCenter).to.equal(certificationCenter);
      });
    });
  });
});
