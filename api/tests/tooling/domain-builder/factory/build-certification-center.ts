// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../../../lib/domain/models/CertificationCenter');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCenter({ id = 1, name = 'name', type = (CertificationCenter as $TSFixMe).types.SUP, externalId = 'externalId', isSupervisorAccessEnabled = false, createdAt = new Date('2020-01-01'), updatedAt, habilitations = [] }: $TSFixMe = {}) {
    return new CertificationCenter({
        id,
        name,
        type,
        externalId,
        isSupervisorAccessEnabled,
        updatedAt,
        createdAt,
        habilitations,
    });
};
