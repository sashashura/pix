import Component from '@glimmer/component';
import { htmlSafe } from '@ember/string';
import round from 'lodash/round';

export default class DistributionGraph extends Component {
  get data() {
    // const data = {
    //   stage_1: {
    //     starCount: 1,
    //     participantsNumber: 6,
    //     prescriberDescription: 'Le premier palier est nul!',
    //   },
    //   participantsTotalNumber: 6,
    // };
    const data = {
      stage_1: {
        starCount: 1,
        participantsNumber: 6,
        prescriberDescription: 'Le premier palier est nul!',
      },
      stage_2: {
        starCount: 2,
        participantsNumber: 4,
        prescriberDescription: 'Le deuxieme palier est bof.',

      },
      stage_3: {
        starCount: 3,
        participantsNumber: 8,
        prescriberDescription: 'Le troisième palier est passable.',

      },
      stage_4: {
        starCount: 4,
        participantsNumber: 12,
        prescriberDescription: 'Le quatrième palier est bien.',

      },
      stage_5: {
        starCount: 5,
        participantsNumber: 1,
        prescriberDescription: 'Ce participant est incroyable!',
      },
    };

    return data;
  }

  distributionPercentage(participantsNumber) {
    const participantsTotalNumber = 31;
    return htmlSafe(`width: ${round((participantsNumber / participantsTotalNumber) * 100)}%`);
  }
}
