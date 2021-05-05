import Component from '@glimmer/component';
import { htmlSafe } from '@ember/string';

export default class DistributionGraph extends Component {
  get data() {
    const data = {
      stage_1: {
        starCount: 1,
        participantsNumber: 6,
        prescriberDescription: 'Le premier palier est nul!',
      },
      participantsTotalNumber: 6,
    };
    // const data = {
    //   stage_1: {
    //     starCount: 1,
    //     participantsNumber: 6,
    //     prescriberDescription: 'Le premier palier est nul!',
    //   },
    //   stage_2: {
    //     starCount: 2,
    //     participantsNumber: 4,
    //     prescriberDescription: 'Le deuxieme palier est bof.',

    //   },
    //   stage_3: {
    //     starCount: 3,
    //     participantsNumber: 8,
    //     prescriberDescription: 'Le troisième palier est passable.',

    //   },
    //   stage_4: {
    //     starCount: 4,
    //     participantsNumber: 12,
    //     prescriberDescription: 'Le quatrième palier est bien.',

    //   },
    //   stage_5: {
    //     starCount: 5,
    //     participantsNumber: 0,
    //     prescriberDescription: 'Ce participant est incroyable!',
    //   },
    //   participantsTotalNumber: 30,
    // };

    return data;
  }

  get distributionPercentage() {
    return htmlSafe(`width: ${(this.data.stage_1.participantsNumber / this.data.participantsTotalNumber) * 100}%`);
  }
  get size() {
    return htmlSafe(`width: ${this.args.value}%`);
  }

}
