// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCpfCityRepository = require('../../../../lib/infrastructure/repositories/certification-cpf-city-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCpfCity = require('../../../../lib/domain/models/CertificationCpfCity');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | certificationCpfCityRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByINSEECode', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are cities matching the INSEE code', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an array of certificationCPFCity', async function () {
        // given
        const INSEECode = '12345';

        const olderCity = domainBuilder.buildCertificationCpfCity({
          id: 1,
          postalCode: '12345',
          INSEECode,
          name: 'OLDER NAME',
          isActualName: false,
        });

        const oldCity = domainBuilder.buildCertificationCpfCity({
          id: 2,
          postalCode: '12345',
          INSEECode,
          name: 'OLD NAME',
          isActualName: false,
        });

        const actualCity = domainBuilder.buildCertificationCpfCity({
          id: 3,
          postalCode: '12345',
          INSEECode,
          name: 'ACTUAL NAME',
          isActualName: true,
        });

        databaseBuilder.factory.buildCertificationCpfCity(actualCity);
        databaseBuilder.factory.buildCertificationCpfCity(oldCity);
        databaseBuilder.factory.buildCertificationCpfCity(olderCity);
        await databaseBuilder.commit();

        // when
        const result = await certificationCpfCityRepository.findByINSEECode({ INSEECode });

        // then
        expect(result).to.be.an.instanceOf(Array);
        expect(result[0]).to.be.an.instanceOf(CertificationCpfCity);
        expect(result).to.deep.equal([actualCity, olderCity, oldCity]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no city matching the INSEE code', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // when
        const result = await certificationCpfCityRepository.findByINSEECode({ INSEECode: 'unknown_INSEE_code' });

        // then
        expect(result).to.be.an.instanceOf(Array);
        expect(result).to.have.lengthOf(0);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByPostalCode', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are cities matching the postal code', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an array of certificationCpfCity', async function () {
        // given
        const postalCode = '12345';

        const olderCity = domainBuilder.buildCertificationCpfCity({
          id: 1,
          postalCode,
          INSEECode: '56789',
          name: 'OLDER NAME',
          isActualName: false,
        });

        const oldCity = domainBuilder.buildCertificationCpfCity({
          id: 2,
          postalCode,
          INSEECode: '56789',
          name: 'OLD NAME',
          isActualName: false,
        });

        const actualCity = domainBuilder.buildCertificationCpfCity({
          id: 3,
          postalCode,
          INSEECode: '56789',
          name: 'ACTUAL NAME',
          isActualName: true,
        });

        databaseBuilder.factory.buildCertificationCpfCity(actualCity);
        databaseBuilder.factory.buildCertificationCpfCity(oldCity);
        databaseBuilder.factory.buildCertificationCpfCity(olderCity);
        await databaseBuilder.commit();

        // when
        const result = await certificationCpfCityRepository.findByPostalCode({ postalCode });

        // then
        expect(result).to.be.an.instanceOf(Array);
        expect(result[0]).to.be.an.instanceOf(CertificationCpfCity);
        expect(result).to.deep.equal([actualCity, olderCity, oldCity]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no city matching the postal code', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // when
        const result = await certificationCpfCityRepository.findByPostalCode({ postalCode: 'unknown_postal_code' });

        // then
        expect(result).to.be.an.instanceOf(Array);
        expect(result).to.have.lengthOf(0);
      });
    });
  });
});
