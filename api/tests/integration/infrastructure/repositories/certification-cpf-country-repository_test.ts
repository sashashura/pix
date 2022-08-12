// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCpfCountryRepository = require('../../../../lib/infrastructure/repositories/certification-cpf-country-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCpfCountry = require('../../../../lib/domain/models/CertificationCpfCountry');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | certificationCpfCountryRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByMatcher', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the country exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the country', async function () {
        // given
        const country = domainBuilder.buildCertificationCpfCountry({
          id: 1,
          code: '99100',
          commonName: 'FRANCE',
          originalName: 'FRANCE',
          matcher: 'ACEFNR',
        });
        databaseBuilder.factory.buildCertificationCpfCountry(country);
        await databaseBuilder.commit();

        // when
        const result = await certificationCpfCountryRepository.getByMatcher({ matcher: country.matcher });

        // then
        expect(result).to.deep.equal(country);
        expect(result).to.be.instanceOf(CertificationCpfCountry);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the country does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // when
        const result = await certificationCpfCountryRepository.getByMatcher({ matcher: 'unknown_matcher' });

        // then
        expect(result).to.be.null;
      });
    });
  });
});
