// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
function certificationCpfCityBuilder({
  databaseBuilder
}: $TSFixMe) {

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'PARIS 1',
    postalCode: '75001',
    INSEECode: '75101',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'PARIS 12',
    postalCode: '75012',
    INSEECode: '75112',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'PARIS 15',
    postalCode: '75015',
    INSEECode: '75115',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'PARIS 19',
    postalCode: '75019',
    INSEECode: '75119',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'PERPIGNAN',
    postalCode: '66000',
    INSEECode: '66136',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'NANTES',
    postalCode: '44000',
    INSEECode: '44109',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'LES-BAUX-DE-BRETEUIL',
    postalCode: '27160',
    INSEECode: '27043',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'MARBOIS',
    postalCode: '27160',
    INSEECode: '27157',
  });

  databaseBuilder.factory.buildCertificationCpfCity({
    name: 'MESNILS-SUR-ITON',
    postalCode: '27160',
    INSEECode: '27240',
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { certificationCpfCityBuilder };
