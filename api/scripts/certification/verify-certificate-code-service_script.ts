// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const verifyCertificationCodeService = require('../../lib/domain/services/verify-certificate-code-service');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const verifyCertificateCodeRepository = require('../../../../lib/infrastructure/repositories/verify-certificate-code-repository');

const addCertification = async () => {
  const code = await verifyCertificationCodeService.getNewVerifyCertificationCode();
  verifyCertificateCodeRepository.addCertification({ code, score: _.random(200, 600) });
};

// 'Generer 80 000 certificate & sur une heure essayer de trouver des couples code/score via brut force'
async function checkBrutForce() {
  const nbCertificates = 1;
  const length = 1000 * 60 * 1;
  const MIN_PIX = 200,
    MAX_PIX = 1200;

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.time('certificats');
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.timeLog('certificats', `\tCreation des ${nbCertificates} certicats`);
  await Promise.all(_.times(nbCertificates, addCertification));

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.timeLog('certificats', `\tBrute force sur ${length / 60000} minutes`);
  const end = new Date().getTime() + length;
  let matches = 0,
    checks = 0;
  while (new Date().getTime() < end) {
    const code = await verifyCertificationCodeService.getNewVerifyCertificationCode();
    for (let i = MIN_PIX; i < MAX_PIX; i++) {
      const hasMatch = verifyCertificateCodeRepository.checkCertification({ code, score: i });
      if (hasMatch) {
        matches++;
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log('There is a matches for ', { code, score: i });
      }
      checks++;
    }
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.timeLog('certificats', checks, 'checks; found ', matches, `code/score pairs in ${length / 60000} minutes`);
}

checkBrutForce();
