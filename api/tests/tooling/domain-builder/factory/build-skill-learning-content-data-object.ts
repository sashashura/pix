// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_ID... Remove this comment to see the full error message
const DEFAULT_ID = 'recSK0X22abcdefgh',
  DEFAULT_HINT = 'Peut-on géo-localiser un lapin sur la banquise ?',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_HI... Remove this comment to see the full error message
  DEFAULT_HINT_STATUS = 'Validé',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_NA... Remove this comment to see the full error message
  DEFAULT_NAME = '@accesDonnées1',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_TU... Remove this comment to see the full error message
  DEFAULT_TUTORIAL_ID = 'recCO0X22abcdefgh',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_CO... Remove this comment to see the full error message
  DEFAULT_COMPETENCE_ID = 'recCT0X22abcdefgh',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PI... Remove this comment to see the full error message
  DEFAULT_PIX_VALUE = 2.4,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_TU... Remove this comment to see the full error message
  DEFAULT_TUBE_ID = 'recTU0X22abcdefgh',
  DEFAULT_VERSION = 1,
  DEFAULT_LEVEL = 1;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function ({
  id = DEFAULT_ID,
  name = DEFAULT_NAME,
  hint = DEFAULT_HINT,
  hintStatus = DEFAULT_HINT_STATUS,
  tutorialIds = [DEFAULT_TUTORIAL_ID],
  competenceId = DEFAULT_COMPETENCE_ID,
  pixValue = DEFAULT_PIX_VALUE,
  tubeId = DEFAULT_TUBE_ID,
  version = DEFAULT_VERSION,
  level = DEFAULT_LEVEL,
} = {}) {
  return {
    id,
    name,
    hint,
    hintStatus,
    tutorialIds,
    pixValue,
    competenceId,
    tubeId,
    version,
    level,
  };
};
