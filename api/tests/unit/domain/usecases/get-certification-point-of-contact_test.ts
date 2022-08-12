// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getCertificationPointOfContact = require('../../../../lib/domain/usecases/get-certification-point-of-contact');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-certification-point-of-contact', function () {
  const userId = 123;
  let certificationPointOfContactRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationPointOfContactRepository = { get: sinon.stub() };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the CertificationPointOfContact', async function () {
    // given
    const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({ id: userId });
    certificationPointOfContactRepository.get.withArgs(userId).resolves(expectedCertificationPointOfContact);

    // when
    const actualCertificationPointOfContact = await getCertificationPointOfContact({
      userId,
      certificationPointOfContactRepository,
    });

    // then
    expect(actualCertificationPointOfContact).to.deep.equal(expectedCertificationPointOfContact);
  });
});
