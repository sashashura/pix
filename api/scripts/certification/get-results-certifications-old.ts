#! /usr/bin/env node

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require('request-promise-native');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'json2csv'.
const json2csv = require('json2csv');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment-timezone');

// request.debug = true;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HEADERS'.
const HEADERS = [
  'Numero certification',
  'Date de début',
  'Date de fin',
  'Note Pix',
  '1.1',
  '1.2',
  '1.3',
  '2.1',
  '2.2',
  '2.3',
  '2.4',
  '3.1',
  '3.2',
  '3.3',
  '3.4',
  '4.1',
  '4.2',
  '4.3',
  '5.1',
  '5.2',
];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseArgs'... Remove this comment to see the full error message
function parseArgs(argv: $TSFixMe) {
  return argv.slice(3);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildReque... Remove this comment to see the full error message
function buildRequestObject(baseUrl: $TSFixMe, authToken: $TSFixMe, certificationId: $TSFixMe) {
  return {
    headers: {
      authorization: 'Bearer ' + authToken,
    },
    baseUrl: baseUrl,
    url: `/api/admin/certifications/${certificationId}/details`,
    json: true,
    transform: (body: $TSFixMe) => {
      body.certificationId = certificationId;
      return body;
    },
  };
}

function makeRequest(config: $TSFixMe) {
  return request(config);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function findCompetence(profile: $TSFixMe, competenceName: $TSFixMe) {
  const result = profile.find((competence: $TSFixMe) => competence.index === competenceName);
  return (result || { obtainedLevel: '' }).obtainedLevel;
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function toCSVRow(rowJSON: $TSFixMe) {
  const res = {};
  const [idColumn, dateStartColumn, dateEndColumn, noteColumn, ...competencesColumns] = HEADERS;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[idColumn] = rowJSON.certificationId;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[dateStartColumn] = moment.utc(rowJSON.createdAt).tz('Europe/Paris').format('DD/MM/YYYY HH:mm:ss');
  if (rowJSON.completedAt) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[dateEndColumn] = moment.utc(rowJSON.completedAt).tz('Europe/Paris').format('DD/MM/YYYY HH:mm:ss');
  } else {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[dateEndColumn] = '';
  }

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[noteColumn] = rowJSON.totalScore;
  competencesColumns.forEach((column) => {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[column] = findCompetence(rowJSON.competencesWithMark, column);
  });
  return res;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
function main() {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const baseUrl = process.argv[2];
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const authToken = process.argv[3];
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const ids = parseArgs(process.argv.slice(4));
  const requests = Promise.all(
    ids.map((id: $TSFixMe) => buildRequestObject(baseUrl, authToken, id)).map((requestObject: $TSFixMe) => makeRequest(requestObject))
  );

  requests
    .then((certificationResults) => certificationResults.map(toCSVRow))
    .then((res) =>
      json2csv({
        data: res,
        fieldNames: HEADERS,
        del: ';',
      })
    )
    .then((csv) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(`\n\n${csv}\n\n`);
      return csv;
    });
}

/*=================== tests =============================*/

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main();
} else {
  // @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
  module.exports = {
    parseArgs,
    toCSVRow,
    buildRequestObject,
    findCompetence,
    HEADERS,
  };
}
