// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
const PixPlusDroitMaitreCertificationResult = require('./../../../../lib/domain/models/PixPlusDroitMaitreCertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
const PixPlusDroitExpertCertificationResult = require('./../../../../lib/domain/models/PixPlusDroitExpertCertificationResult');

const buildPixPlusDroitCertificationResult = function ({ status = (PixPlusDroitMaitreCertificationResult.statuses as $TSFixMe).ACQUIRED, } = {}) {
    return new PixPlusDroitMaitreCertificationResult({
        status,
    });
};

buildPixPlusDroitCertificationResult.maitre = function ({ status = (PixPlusDroitMaitreCertificationResult.statuses as $TSFixMe).ACQUIRED, }) {
    return new PixPlusDroitMaitreCertificationResult({
        status,
    });
};

buildPixPlusDroitCertificationResult.expert = function ({ status = (PixPlusDroitExpertCertificationResult.statuses as $TSFixMe).ACQUIRED, }) {
    return new PixPlusDroitExpertCertificationResult({
        status,
    });
};

(buildPixPlusDroitCertificationResult.maitre as $TSFixMe).acquired = function () {
    return new PixPlusDroitMaitreCertificationResult({
        // @ts-expect-error TS(2339): Property 'ACQUIRED' does not exist on type '{ DOWN... Remove this comment to see the full error message
        status: PixPlusDroitMaitreCertificationResult.statuses.ACQUIRED,
    });
};
  return new PixPlusDroitMaitreCertificationResult({
    status: (PixPlusDroitMaitreCertificationResult.statuses as $TSFixMe).ACQUIRED,
});
};

(buildPixPlusDroitCertificationResult.maitre as $TSFixMe).rejected = function () {
    return new PixPlusDroitMaitreCertificationResult({
        // @ts-expect-error TS(2339): Property 'REJECTED' does not exist on type '{ DOWN... Remove this comment to see the full error message
        status: PixPlusDroitMaitreCertificationResult.statuses.REJECTED,
    });
};
  return new PixPlusDroitMaitreCertificationResult({
    status: (PixPlusDroitMaitreCertificationResult.statuses as $TSFixMe).REJECTED,
});
};

(buildPixPlusDroitCertificationResult.maitre as $TSFixMe).notTaken = function () {
    return new PixPlusDroitMaitreCertificationResult({
        // @ts-expect-error TS(2339): Property 'NOT_TAKEN' does not exist on type '{ DOW... Remove this comment to see the full error message
        status: PixPlusDroitMaitreCertificationResult.statuses.NOT_TAKEN,
    });
};
  return new PixPlusDroitMaitreCertificationResult({
    status: (PixPlusDroitMaitreCertificationResult.statuses as $TSFixMe).NOT_TAKEN,
});
};

(buildPixPlusDroitCertificationResult.expert as $TSFixMe).acquired = function () {
    return new PixPlusDroitExpertCertificationResult({
        // @ts-expect-error TS(2339): Property 'ACQUIRED' does not exist on type '{ DOWN... Remove this comment to see the full error message
        status: PixPlusDroitExpertCertificationResult.statuses.ACQUIRED,
    });
};
  return new PixPlusDroitExpertCertificationResult({
    status: (PixPlusDroitExpertCertificationResult.statuses as $TSFixMe).ACQUIRED,
});
};

(buildPixPlusDroitCertificationResult.expert as $TSFixMe).rejected = function () {
    return new PixPlusDroitExpertCertificationResult({
        // @ts-expect-error TS(2339): Property 'REJECTED' does not exist on type '{ DOWN... Remove this comment to see the full error message
        status: PixPlusDroitExpertCertificationResult.statuses.REJECTED,
    });
};
  return new PixPlusDroitExpertCertificationResult({
    status: (PixPlusDroitExpertCertificationResult.statuses as $TSFixMe).REJECTED,
});
};

(buildPixPlusDroitCertificationResult.expert as $TSFixMe).notTaken = function () {
    return new PixPlusDroitExpertCertificationResult({
        // @ts-expect-error TS(2339): Property 'NOT_TAKEN' does not exist on type '{ DOW... Remove this comment to see the full error message
        status: PixPlusDroitExpertCertificationResult.statuses.NOT_TAKEN,
    });
};
  return new PixPlusDroitExpertCertificationResult({
    status: (PixPlusDroitExpertCertificationResult.statuses as $TSFixMe).NOT_TAKEN,
});
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildPixPlusDroitCertificationResult;
