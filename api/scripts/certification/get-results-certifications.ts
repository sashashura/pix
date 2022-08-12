#! /usr/bin/env node

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const fileSystem = require('fs');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require('request-promise-native');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'json2csv'.
const json2csv = require('json2csv');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment-timezone');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HEADERS'.
const HEADERS = [
  'ID de certification',
  'Prenom du candidat',
  'Nom du candidat',
  'Date de naissance du candidat',
  'Lieu de naissance du candidat',
  'Identifiant Externe',
  'Statut de la certification',
  'ID de session',
  'Date de debut',
  'Date de fin',
  'Commentaire pour le candidat',
  "Commentaire pour l'organisation",
  'Commentaire pour le jury',
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

function buildSessionRequest(baseUrl: $TSFixMe, authToken: $TSFixMe, sessionId: $TSFixMe) {
  return {
    headers: {
      authorization: 'Bearer ' + authToken,
    },
    baseUrl: baseUrl,
    url: `/api/sessions/${sessionId}`,
    json: true,
  };
}

function buildCertificationRequest(baseUrl: $TSFixMe, authToken: $TSFixMe, certificationId: $TSFixMe) {
  return {
    headers: {
      authorization: 'Bearer ' + authToken,
    },
    baseUrl: baseUrl,
    url: `/api/admin/certifications/${certificationId}`,
    json: true,
    simple: false,
  };
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findCompet... Remove this comment to see the full error message
function findCompetence(profile: $TSFixMe, competenceName: $TSFixMe) {
  const result = profile.find((competence: $TSFixMe) => competence.competence_code === competenceName);
  return (result || { level: '' }).level;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toCSVRow'.
function toCSVRow(rowJSON: $TSFixMe) {
  if (!rowJSON.data) {
    return {};
  }
  const certificationData = rowJSON.data.attributes;
  const res = {};

  const [
    id,
    firstname,
    lastname,
    birthdate,
    birthplace,
    externalId,
    status,
    sessionNumber,
    dateStart,
    dateEnd,
    commentCandidate,
    commentOrganization,
    commentJury,
    note,
    ...competencess
  ] = HEADERS;

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[id] = certificationData['certification-id'];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[firstname] = certificationData['first-name'];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[lastname] = certificationData['last-name'];

  if (certificationData['birthdate']) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[birthdate] = moment.utc(certificationData['birthdate'], 'YYYY-MM-DD').tz('Europe/Paris').format('DD/MM/YYYY');
  } else {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[birthdate] = '';
  }

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[birthplace] = certificationData['birthplace'];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[externalId] = certificationData['external-id'];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[status] = certificationData['status'];

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[sessionNumber] = certificationData['session-id'];

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[dateStart] = moment.utc(certificationData['created-at']).tz('Europe/Paris').format('DD/MM/YYYY HH:mm:ss');
  if (certificationData['completed-at']) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[dateEnd] = moment(certificationData['completed-at']).tz('Europe/Paris').format('DD/MM/YYYY HH:mm:ss');
  } else {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[dateEnd] = '';
  }

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[commentCandidate] = certificationData['comment-for-candidate'];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[commentOrganization] = certificationData['comment-for-organization'];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[commentJury] = certificationData['comment-for-jury'];

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  res[note] = certificationData['pix-score'];

  competencess.forEach((column) => {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    res[column] = findCompetence(certificationData['competences-with-mark'], column);
  });

  return res;
}

function saveInFile(csv: $TSFixMe, sessionId: $TSFixMe) {
  const filepath = `session_${sessionId}_export_${moment.utc().format('DD-MM-YYYY_HH-mm')}.csv`;
  fileSystem.writeFile(filepath, csv, (err: $TSFixMe) => {
    if (err) throw err;
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Les données de certifications sont dans le fichier :' + filepath);
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
function main() {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const baseUrl = process.argv[2];
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const authToken = process.argv[3];
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const sessionId = process.argv[4];
  const sessionRequest = buildSessionRequest(baseUrl, authToken, sessionId);
  return request(sessionRequest)
    .then((session: $TSFixMe) => {
      return session.data.relationships.certifications.data.map((certification: $TSFixMe) => {
        return certification.id;
      });
    })
    .catch((err: $TSFixMe) => {
      if (err.statusCode === 404) {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.error(err);
        throw new Error("L'id session n'existe pas");
      }
    })
    .then((certificationIds: $TSFixMe) => {
      const certificationsRequests = Promise.all(
        certificationIds
          .map((certificationId: $TSFixMe) => buildCertificationRequest(baseUrl, authToken, certificationId))
          .map((requestObject: $TSFixMe) => request(requestObject))
      );

      return certificationsRequests
        .then((certificationResults) => certificationResults.map(toCSVRow))
        .then((certificationResult) =>
          json2csv({
            data: certificationResult,
            fieldNames: HEADERS,
            del: ';',
            withBOM: true,
          })
        )
        .then((csv) => {
          saveInFile(csv, sessionId);
          // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
          console.log(`\n\n${csv}\n\n`);
          return csv;
        });
    })
    .catch((err: $TSFixMe) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(err.message);
    });
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main();
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  buildCertificationRequest,
  toCSVRow,
  findCompetence,
  buildSessionRequest,
};
