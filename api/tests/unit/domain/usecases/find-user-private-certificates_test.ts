// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findUserPrivateCertificates = require('../../../../lib/domain/usecases/find-user-private-certificates');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-user-private-certificates', function () {
  const privateCertificateRepository = {};

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    (privateCertificateRepository as $TSFixMe).findByUserId = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the private certificates', async function () {
    // given
    const privateCertificate1 = domainBuilder.buildPrivateCertificate();
    const privateCertificate2 = domainBuilder.buildPrivateCertificate();
    (privateCertificateRepository as $TSFixMe).findByUserId
    .withArgs({ userId: 123 })
    .resolves([privateCertificate1, privateCertificate2]);

    // when
    const privateCertificates = await findUserPrivateCertificates({ userId: 123, privateCertificateRepository });

    // then
    expect(privateCertificates).to.deep.equal([privateCertificate1, privateCertificate2]);
  });
});
