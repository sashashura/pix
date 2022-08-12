// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
function certificationCpfCountryBuilder({
  databaseBuilder
}: $TSFixMe) {

  databaseBuilder.factory.buildCertificationCpfCountry({
    code: '99401',
    commonName: 'CANADA',
    originalName: 'CANADA',
  });

  databaseBuilder.factory.buildCertificationCpfCountry({
    code: '99100',
    commonName: 'FRANCE',
    originalName: 'FRANCE',
  });

  databaseBuilder.factory.buildCertificationCpfCountry({
    code: '99345',
    commonName: 'TOGO',
    originalName: 'TOGO',
  });

  databaseBuilder.factory.buildCertificationCpfCountry({
    code: '99243',
    commonName: 'VIET NAM',
    originalName: 'VIET NAM',
  });

  databaseBuilder.factory.buildCertificationCpfCountry({
    code: '99425',
    commonName: 'TURKS ET CAIQUES (ILES)',
    originalName: 'TURKS ET CAÏQUES (ÎLES)',
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { certificationCpfCountryBuilder };
