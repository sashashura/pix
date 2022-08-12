// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ACTIVE_STA... Remove this comment to see the full error message
const ACTIVE_STATUS = 'actif';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_ID... Remove this comment to see the full error message
const DEFAULT_ID = 'recSK0X22abcdefgh',
  DEFAULT_HINT_FR_FR = 'Peut-on géo-localiser un lapin sur la banquise ?',
  DEFAULT_HINT_EN_US = 'Can we geo-locate a rabbit on the ice floe?',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_HI... Remove this comment to see the full error message
  DEFAULT_HINT_STATUS = 'Validé',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_NA... Remove this comment to see the full error message
  DEFAULT_NAME = '@accesDonnées1',
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_TU... Remove this comment to see the full error message
  DEFAULT_TUTORIAL_ID = 'recCO0X22abcdefgh',
  DEFAULT_LEARNING_TUTORIAL_IDS = ['recSP0X22abcdefgh', 'recSP0X23abcdefgh'],
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_CO... Remove this comment to see the full error message
  DEFAULT_COMPETENCE_ID = 'recCT0X22abcdefgh',
  DEFAULT_STATUS = ACTIVE_STATUS,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PI... Remove this comment to see the full error message
  DEFAULT_PIX_VALUE = 2.4,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_TU... Remove this comment to see the full error message
  DEFAULT_TUBE_ID = 'recTU0X22abcdefgh';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function SkillLearningContentDataObjectFixture({
  id = DEFAULT_ID,
  name = DEFAULT_NAME,
  hintEnUs = DEFAULT_HINT_EN_US,
  hintFrFr = DEFAULT_HINT_FR_FR,
  hintStatus = DEFAULT_HINT_STATUS,
  tutorialIds = [DEFAULT_TUTORIAL_ID],
  learningMoreTutorialIds = DEFAULT_LEARNING_TUTORIAL_IDS,
  competenceId = DEFAULT_COMPETENCE_ID,
  pixValue = DEFAULT_PIX_VALUE,
  status = DEFAULT_STATUS,
  tubeId = DEFAULT_TUBE_ID,
} = {}) {
  return {
    id,
    name,
    hintEnUs,
    hintFrFr,
    hintStatus,
    tutorialIds,
    learningMoreTutorialIds,
    competenceId,
    pixValue,
    status,
    tubeId,
  };
};
