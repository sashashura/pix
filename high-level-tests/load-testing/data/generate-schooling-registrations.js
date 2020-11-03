const js2xmlparser = require('js2xmlparser');
const faker = require('faker');

const run = function() {

  const ELEVES = [];
  const USER_COUNT = 5;

  for (let i = 0; i < USER_COUNT; i++) {

    const ELEVE = {
      ELEVE_ID: (Date.now()).toString().slice(0, -6),
      ELENOET: '6044',
      ID_NATIONAL: '071340028HH',
      // INE_BEA': '1814023809K',
      // INE_RNIE': '071340028HH',
      // ELENOET': '6044',
      // ID_ELEVE_ETAB': '06044180777',
      // NOM_DE_FAMILLE': 'DUPOND',
      // PRENOM': 'Julien',
      // DATE_NAISS': '01/04/1956',
      // DOUBLEMENT': '0',
      // CODE_PAYS': '100',
      // ACCEPTE_SMS': '0',
      // DATE_MODIFICATION': '05/07/2019',
      // DATE_SORTIE': '01/09/2019',
      // CODE_REGIME': '2',
      // DATE_ENTREE': '09/02/2014',
      // CODE_MOTIF_SORTIE': '10',
      // CODE_SEXE': '1',
      // TEL_PORTABLE': '+33612345678',
      // CODE_PAYS_NAT': '100',
      // CODE_DEPARTEMENT_NAISS': '077',
      // CODE_COMMUNE_INSEE_NAISS': '77288',
      // ADHESION_TRANSPORT': '0',
      // CODE_PROVENANCE': '1',
      // SCOLARITE_AN_DERNIER': {
      //   CODE_MEF: '10310019110',
      //   CODE_STRUCTURE: '3E 5',
      //   CODE_RNE: '0180777X',
      //   CODE_NATURE: '340',
      //   SIGLE: 'CLG',
      //   DENOM_PRINC: 'COLLEGE',
      //   DENOM_COMPL: 'JEAN RENOIR',
      //   LIGNE1_ADRESSE: '40 rue des Fileuses',
      //   MEL: 'ce.0180777X@ac-orleans-tours.fr',
      //   TELEPHONE: '0248202445',
      //   CODE_COMMUNE_INSEE: '18033',
      //   LL_COMMUNE_INSEE: 'BOURGES'
      // }
    };

    ELEVES.push(ELEVE);
  }

  const elevesRootNode = { 'ELEVE' : ELEVES };
  const rootXMLNode = 'ELEVES';
  console.log(js2xmlparser.parse(rootXMLNode,  elevesRootNode));
};

run();

module.exports = { run };
