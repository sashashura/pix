// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');

// @ts-expect-error TS(7023): 'generate' implicitly has return type 'any' becaus... Remove this comment to see the full error message
function generate(campaignRepository: $TSFixMe, pendingList = []) {
  const letters = randomString.generate({
    length: 6,
    charset: 'alphabetic',
    capitalization: 'uppercase',
    readable: true,
  });
  const numbers = randomString.generate({ length: 3, charset: 'numeric', readable: true });

  const generatedCampaignCode = letters.concat(numbers);

  // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
  if (pendingList.includes(generatedCampaignCode)) {
    return generate(campaignRepository, pendingList);
  }

  return campaignRepository.isCodeAvailable(generatedCampaignCode).then((isCodeAvailable: $TSFixMe) => {
    if (isCodeAvailable) {
      return Promise.resolve(generatedCampaignCode);
    }
    return generate(campaignRepository, pendingList);
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generate,
};
