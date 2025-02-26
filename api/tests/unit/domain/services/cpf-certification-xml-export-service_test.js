const { expect, domainBuilder, sinon, streamToPromise } = require('../../../test-helper');
const { PassThrough } = require('stream');
const proxyquire = require('proxyquire');
const moment = require('moment');
const cpfCertificationXmlExportService = proxyquire(
  '../../../../lib/domain/services/cpf-certification-xml-export-service',
  {
    uuid: {
      v4: () => {
        return '5d079a5d-0a4d-45ac-854d-256b01cacdfe';
      },
    },
  }
);

describe('Unit | Services | cpf-certification-xml-export-service', function () {
  let clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    clock.restore();
  });

  describe('getXmlExport', function () {
    it('should return an writable stream with cpf certification results', async function () {
      // given
      const firstCpfCertificationResult = domainBuilder.buildCpfCertificationResult({
        id: 1234,
        firstName: 'Bart',
        lastName: 'Haba',
        birthdate: '1993-05-23',
        sex: 'M',
        birthINSEECode: null,
        birthPostalCode: '75002',
        publishedAt: '2022-01-03',
        pixScore: 324,
        competenceMarks: [
          { competenceCode: '2.1', level: 4 },
          { competenceCode: '3.2', level: 3 },
        ],
      });

      const secondCpfCertificationResult = domainBuilder.buildCpfCertificationResult({
        id: 4567,
        firstName: 'Eva',
        lastName: 'Porée',
        birthdate: '1992-11-03',
        sex: 'F',
        birthINSEECode: '75114',
        birthPostalCode: null,
        publishedAt: '2022-01-07',
        pixScore: 512,
        competenceMarks: [
          { competenceCode: '1.1', level: 1 },
          { competenceCode: '4.2', level: 2 },
        ],
      });
      const writableStream = new PassThrough();

      // when
      cpfCertificationXmlExportService.buildXmlExport({
        cpfCertificationResults: [firstCpfCertificationResult, secondCpfCertificationResult],
        writableStream,
        opts: { prettyPrint: true },
      });

      //then
      const expectedXmlExport = _getExpectedXmlExport();
      const xmlExport = await streamToPromise(writableStream);
      expect(xmlExport).to.equal(expectedXmlExport);
    });
  });
});

function _getExpectedXmlExport() {
  return `<?xml version="1.0"?>
<cpf:flux xmlns:cpf="urn:cdc:cpf:pc5:schema:1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <cpf:idFlux>
    5d079a5d-0a4d-45ac-854d-256b01cacdfe
  </cpf:idFlux>
  <cpf:horodatage>
    ${moment(new Date()).format('YYYY-MM-DDThh:mm:ssZ')}
  </cpf:horodatage>
  <cpf:emetteur>
    <cpf:idClient>
      03VML243
    </cpf:idClient>
    <cpf:certificateurs>
      <cpf:certificateur>
        <cpf:idClient>
          03VML243
        </cpf:idClient>
        <cpf:idContrat>
          MCFCER000209
        </cpf:idContrat>
        <cpf:certifications>
          <cpf:certification>
            <cpf:type>
              RS
            </cpf:type>
            <cpf:code>
              RS5875
            </cpf:code>
            <cpf:natureDeposant>
              CERTIFICATEUR
            </cpf:natureDeposant>
            <cpf:passageCertifications>
              <cpf:passageCertification>
                <cpf:idTechnique>
                  1234
                </cpf:idTechnique>
                <cpf:obtentionCertification>
                  PAR_SCORING
                </cpf:obtentionCertification>
                <cpf:donneeCertifiee>
                  true
                </cpf:donneeCertifiee>
                <cpf:dateDebutValidite>
                  2022-01-03
                </cpf:dateDebutValidite>
                <cpf:dateFinValidite xsi:nil="true"></cpf:dateFinValidite>
                <cpf:presenceNiveauLangueEuro>
                  false
                </cpf:presenceNiveauLangueEuro>
                <cpf:presenceNiveauNumeriqueEuro>
                  true
                </cpf:presenceNiveauNumeriqueEuro>
                <cpf:niveauNumeriqueEuropeen>
                  <cpf:scoreGeneral>
                    324
                  </cpf:scoreGeneral>
                  <cpf:resultats>
                    <cpf:resultat>
                      <cpf:niveau>
                        4
                      </cpf:niveau>
                      <cpf:domaineCompetenceId>
                        2
                      </cpf:domaineCompetenceId>
                      <cpf:competenceId>
                        1
                      </cpf:competenceId>
                    </cpf:resultat>
                    <cpf:resultat>
                      <cpf:niveau>
                        4
                      </cpf:niveau>
                      <cpf:domaineCompetenceId>
                        2
                      </cpf:domaineCompetenceId>
                      <cpf:competenceId>
                        5
                      </cpf:competenceId>
                    </cpf:resultat>
                  </cpf:resultats>
                </cpf:niveauNumeriqueEuropeen>
                <cpf:scoring>
                  324
                </cpf:scoring>
                <cpf:mentionValidee xsi:nil="true"></cpf:mentionValidee>
                <cpf:modalitesInscription>
                  <cpf:modaliteAcces xsi:nil="true"></cpf:modaliteAcces>
                </cpf:modalitesInscription>
                <cpf:identificationTitulaire>
                  <cpf:titulaire>
                    <cpf:nomNaissance>
                      Haba
                    </cpf:nomNaissance>
                    <cpf:nomUsage xsi:nil="true"></cpf:nomUsage>
                    <cpf:prenom1>
                      Bart
                    </cpf:prenom1>
                    <cpf:anneeNaissance>
                      1993
                    </cpf:anneeNaissance>
                    <cpf:moisNaissance>
                      05
                    </cpf:moisNaissance>
                    <cpf:jourNaissance>
                      23
                    </cpf:jourNaissance>
                    <cpf:sexe>
                      M
                    </cpf:sexe>
                    <cpf:codeCommuneNaissance>
                      <cpf:codePostalNaissance>
                        <cpf:codePostal>
                          75002
                        </cpf:codePostal>
                      </cpf:codePostalNaissance>
                    </cpf:codeCommuneNaissance>
                  </cpf:titulaire>
                </cpf:identificationTitulaire>
              </cpf:passageCertification>
              <cpf:passageCertification>
                <cpf:idTechnique>
                  4567
                </cpf:idTechnique>
                <cpf:obtentionCertification>
                  PAR_SCORING
                </cpf:obtentionCertification>
                <cpf:donneeCertifiee>
                  true
                </cpf:donneeCertifiee>
                <cpf:dateDebutValidite>
                  2022-01-07
                </cpf:dateDebutValidite>
                <cpf:dateFinValidite xsi:nil="true"></cpf:dateFinValidite>
                <cpf:presenceNiveauLangueEuro>
                  false
                </cpf:presenceNiveauLangueEuro>
                <cpf:presenceNiveauNumeriqueEuro>
                  true
                </cpf:presenceNiveauNumeriqueEuro>
                <cpf:niveauNumeriqueEuropeen>
                  <cpf:scoreGeneral>
                    512
                  </cpf:scoreGeneral>
                  <cpf:resultats>
                    <cpf:resultat>
                      <cpf:niveau>
                        1
                      </cpf:niveau>
                      <cpf:domaineCompetenceId>
                        1
                      </cpf:domaineCompetenceId>
                      <cpf:competenceId>
                        1
                      </cpf:competenceId>
                    </cpf:resultat>
                    <cpf:resultat>
                      <cpf:niveau>
                        1
                      </cpf:niveau>
                      <cpf:domaineCompetenceId>
                        1
                      </cpf:domaineCompetenceId>
                      <cpf:competenceId>
                        2
                      </cpf:competenceId>
                    </cpf:resultat>
                    <cpf:resultat>
                      <cpf:niveau>
                        2
                      </cpf:niveau>
                      <cpf:domaineCompetenceId>
                        4
                      </cpf:domaineCompetenceId>
                      <cpf:competenceId>
                        2
                      </cpf:competenceId>
                    </cpf:resultat>
                  </cpf:resultats>
                </cpf:niveauNumeriqueEuropeen>
                <cpf:scoring>
                  512
                </cpf:scoring>
                <cpf:mentionValidee xsi:nil="true"></cpf:mentionValidee>
                <cpf:modalitesInscription>
                  <cpf:modaliteAcces xsi:nil="true"></cpf:modaliteAcces>
                </cpf:modalitesInscription>
                <cpf:identificationTitulaire>
                  <cpf:titulaire>
                    <cpf:nomNaissance>
                      Porée
                    </cpf:nomNaissance>
                    <cpf:nomUsage xsi:nil="true"></cpf:nomUsage>
                    <cpf:prenom1>
                      Eva
                    </cpf:prenom1>
                    <cpf:anneeNaissance>
                      1992
                    </cpf:anneeNaissance>
                    <cpf:moisNaissance>
                      11
                    </cpf:moisNaissance>
                    <cpf:jourNaissance>
                      03
                    </cpf:jourNaissance>
                    <cpf:sexe>
                      F
                    </cpf:sexe>
                    <cpf:codeCommuneNaissance>
                      <cpf:codeInseeNaissance>
                        <cpf:codeInsee>
                          75114
                        </cpf:codeInsee>
                      </cpf:codeInseeNaissance>
                    </cpf:codeCommuneNaissance>
                  </cpf:titulaire>
                </cpf:identificationTitulaire>
              </cpf:passageCertification>
            </cpf:passageCertifications>
          </cpf:certification>
        </cpf:certifications>
      </cpf:certificateur>
    </cpf:certificateurs>
  </cpf:emetteur>
</cpf:flux>`;
}
