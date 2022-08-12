// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
const Challenge = require('../../../../lib/domain/models/Challenge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
const Validator = require('../../../../lib/domain/models/Validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildSkill... Remove this comment to see the full error message
const buildSkill = require('./build-skill');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildChallenge({
  id = 'recCHAL1',

  // attributes
  attachments = ['URL pièce jointe'],

  embedHeight,
  embedTitle,
  embedUrl,
  format = 'petit',
  illustrationUrl = "Une URL vers l'illustration",
  illustrationAlt = "Le texte de l'illustration",
  instruction = 'Des instructions',
  alternativeInstruction = 'Des instructions alternatives',
  proposals = 'Une proposition',
  status = 'validé',
  timer,
  type = Challenge.Type.QCM,
  locales = ['fr'],
  autoReply = false,
  discriminant = 0,
  difficulty = 0,
  responsive = 'Smartphone/Tablette',
  genealogy = 'Prototype 1',
  focused = false,

  // includes
  answer,

  validator = new Validator(),
  skill = buildSkill(),

  // references
  competenceId = 'recCOMP1'
}: $TSFixMe = {}) {
  return new Challenge({
    id,
    // attributes
    attachments,
    embedHeight,
    embedTitle,
    embedUrl,
    format,
    illustrationUrl,
    instruction,
    proposals,
    status,
    timer,
    type,
    locales,
    autoReply,
    discriminant,
    difficulty,
    alternativeInstruction,
    genealogy,
    responsive,
    focused,
    // includes
    answer,
    validator,
    skill,
    // references
    competenceId,
    illustrationAlt,
  });
};
