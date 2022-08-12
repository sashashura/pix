// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getPrivateCertificate({
  certificationId,
  userId,
  locale,
  privateCertificateRepository
}: $TSFixMe) {
  const privateCertificate = await privateCertificateRepository.get(certificationId, { locale });
  if (privateCertificate.userId !== userId) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
    throw new NotFoundError();
  }

  return privateCertificate;
};
