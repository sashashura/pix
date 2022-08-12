// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SiecleXmlI... Remove this comment to see the full error message
const { SiecleXmlImportError } = require('../../../domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const xml2js = require('xml2js');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const saxPath = require('saxpath');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, isUndefined } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SiecleFile... Remove this comment to see the full error message
const SiecleFileStreamer = require('../../utils/xml/siecle-file-streamer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const XMLOrganizationLearnerSet = require('./xml-organization-learner-set');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  UAI_MISMATCHED: 'UAI_MISMATCHED',
};

const NODE_ORGANIZATION_UAI = '/BEE_ELEVES/PARAMETRES/UAJ';
const NODES_ORGANIZATION_LEARNERS = '/BEE_ELEVES/DONNEES/*/*';
const ELEVE_ELEMENT = '<ELEVE';
const STRUCTURE_ELEVE_ELEMENT = '<STRUCTURES_ELEVE';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SieclePars... Remove this comment to see the full error message
class SiecleParser {
  organization: $TSFixMe;
  organizationLearnersSet: $TSFixMe;
  path: $TSFixMe;
  siecleFileStreamer: $TSFixMe;
  constructor(organization: $TSFixMe, path: $TSFixMe) {
    this.organization = organization;
    this.path = path;
    this.organizationLearnersSet = new XMLOrganizationLearnerSet();
  }

  async parse() {
    this.siecleFileStreamer = await SiecleFileStreamer.create(this.path);

    await this._parseUAI();

    await this._parseStudents();

    await this.siecleFileStreamer.close();

    return this.organizationLearnersSet.organizationLearners.filter(
      (organizationLearner: $TSFixMe) => !isUndefined(organizationLearner.division)
    );
  }

  async _parseUAI() {
    await this.siecleFileStreamer.perform((stream: $TSFixMe, resolve: $TSFixMe, reject: $TSFixMe) => this._checkUAI(stream, resolve, reject));
  }

  async _checkUAI(stream: $TSFixMe, resolve: $TSFixMe, reject: $TSFixMe) {
    const streamerToParseOrganizationUAI = new saxPath.SaXPath(stream, NODE_ORGANIZATION_UAI);

    streamerToParseOrganizationUAI.once('match', (xmlNode: $TSFixMe) => {
      xml2js.parseString(xmlNode, (err: $TSFixMe, nodeData: $TSFixMe) => {
        if (err) return reject(err); // Si j'enleve cette ligne les tests passent
        const UAIFromUserOrganization = this.organization.externalId;
        if (nodeData.UAJ !== UAIFromUserOrganization) {
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          reject(new SiecleXmlImportError((ERRORS as $TSFixMe).UAI_MISMATCHED));
        } else {
          resolve();
        }
      });
    });

    stream.on('end', () => {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      reject(new SiecleXmlImportError((ERRORS as $TSFixMe).UAI_MISMATCHED));
    });
  }

  async _parseStudents() {
    await this.siecleFileStreamer.perform((stream: $TSFixMe, resolve: $TSFixMe, reject: $TSFixMe) =>
      this._extractOrganizationLearnersFromStream(stream, resolve, reject)
    );
  }

  _extractOrganizationLearnersFromStream(saxParser: $TSFixMe, resolve: $TSFixMe, reject: $TSFixMe) {
    const streamerToParseOrganizationLearners = new saxPath.SaXPath(saxParser, NODES_ORGANIZATION_LEARNERS);
    streamerToParseOrganizationLearners.on('match', (xmlNode: $TSFixMe) => {
      if (_isOrganizationLearnerNode(xmlNode)) {
        xml2js.parseString(xmlNode, (err: $TSFixMe, nodeData: $TSFixMe) => {
          try {
            if (err) throw err; // Si j'enleve cette ligne les tests passent

            if (_isNodeImportableStudent(nodeData)) {
              this.organizationLearnersSet.add(nodeData.ELEVE.$.ELEVE_ID, nodeData.ELEVE);
            } else if (_isNodeImportableStructures(nodeData, this.organizationLearnersSet)) {
              this.organizationLearnersSet.updateDivision(nodeData);
            }
          } catch (err) {
            reject(err);
          }
        });
      }
    });

    streamerToParseOrganizationLearners.on('end', resolve);
  }
}

function _isOrganizationLearnerNode(xmlNode: $TSFixMe) {
  return xmlNode.startsWith(ELEVE_ELEMENT) || xmlNode.startsWith(STRUCTURE_ELEVE_ELEMENT);
}

function _isNodeImportableStudent(nodeData: $TSFixMe) {
  return nodeData.ELEVE && _isImportable(nodeData.ELEVE);
}

function _isNodeImportableStructures(nodeData: $TSFixMe, organizationLearnersSet: $TSFixMe) {
  return nodeData.STRUCTURES_ELEVE && organizationLearnersSet.has(nodeData.STRUCTURES_ELEVE.$.ELEVE_ID);
}

function _isImportable(studentData: $TSFixMe) {
  const isStudentNotLeftOrganizationLearner = isEmpty(studentData.DATE_SORTIE);
  const isStudentNotYetArrivedOrganizationLearner = !isEmpty(studentData.ID_NATIONAL);
  return isStudentNotLeftOrganizationLearner && isStudentNotYetArrivedOrganizationLearner;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SiecleParser;
