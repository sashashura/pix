#! /usr/bin/env node

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require('request-promise-native');

// @ts-expect-error TS(2393): Duplicate function implementation.
function parseArgs(argv: $TSFixMe) {
  return argv.slice(3);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function buildRequestObject(baseUrl: $TSFixMe, assessmentId: $TSFixMe) {
  return {
    baseUrl: baseUrl,
    method: 'POST',
    url: '/api/assessment-results/',
    json: true,
    body: {
      data: {
        attributes: {
          'estimated-level': null,
          'pix-score': null,
        },
        relationships: {
          assessment: {
            data: {
              type: 'assessments',
              id: assessmentId,
            },
          },
        },
        type: 'assessment-results',
      },
    },
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
function main() {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const baseUrl = process.argv[2];
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const ids = parseArgs(process.argv);
  const requests = Promise.all(
    ids.map((id: $TSFixMe) => buildRequestObject(baseUrl, id)).map((requestObject: $TSFixMe) => request(requestObject))
  );

  return requests.then(() => {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Update EstimatedLevel and PixScore for : ' + ids);
  });
}

/*=================== tests =============================*/

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Start script : ');
  main();
}
