// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getShareableCertificate({
  verificationCode,
  shareableCertificateRepository,
  locale
}: $TSFixMe) {
  const shareableCertificate = await shareableCertificateRepository.getByVerificationCode(verificationCode, { locale });

  return shareableCertificate;
};
