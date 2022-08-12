// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, catchErr } = require('../../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvOrganiz... Remove this comment to see the full error message
  CsvOrganizationLearnerParser,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvColumn'... Remove this comment to see the full error message
  CsvColumn,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/infrastructure/serializers/csv/csv-learner-parser');

class FakeLearnerSet {
  learners: $TSFixMe;
  constructor() {
    this.learners = [];
  }
  addLearner(learner: $TSFixMe) {
    this.learners.push(learner);
  }
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | CsvOrganizationLearnerParser', function () {
  const organizationId = 123;
  let learnerSet: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    learnerSet = new FakeLearnerSet();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the header is correctly formed', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lines', function () {
      const columns = [
        new CsvColumn({ name: 'col1', label: 'Column 1' }),
        new CsvColumn({ name: 'col2', label: 'Column 2' }),
      ];

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns a SupOrganizationLearnerSet with an organization learner for each line', function () {
        const input = `Column 1;Column 2;
        Beatrix;The;
        O-Ren;;
        `;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

        parser.parse();

        expect(learnerSet.learners).to.have.lengthOf(2);
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are different date formats', function () {
      const columns = [
        new CsvColumn({ name: 'col1', label: 'Column 1' }),
        new CsvColumn({ name: 'col2', label: 'Column 2', isDate: true }),
      ];

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a parsing error', function () {
        const input = `Column 1;Column 2;
        O-Ren;2010-01-20;
        O-Ren;20/01/2010;
        O-Ren;20/01/10;
        `;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

        parser.parse();

        expect(learnerSet.learners[0].col2).to.equal('2010-01-20');
        expect(learnerSet.learners[1].col2).to.equal('2010-01-20');
        expect(learnerSet.learners[2].col2).to.equal('2010-01-20');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a validation error', function () {
      const columns = [new CsvColumn({ name: 'ColumnName', label: 'ColumnLabel' })];

      let error: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        learnerSet.addLearner = function () {
          throw error;
        };
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.why is min_length', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'min_length';
          error.limit = 12;

          const input = `ColumnLabel;
          Beatrix;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_MIN_LENGTH');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'ColumnLabel', limit: 12 });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.why is max_length', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'max_length';
          error.limit = 8;

          const input = `ColumnLabel;
          Beatrix;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_MAX_LENGTH');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'ColumnLabel', limit: 8 });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.why is required', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'required';

          const input = `ColumnLabel;
          Beatrix;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_REQUIRED');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'ColumnLabel' });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.why is bad_values', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'bad_values';
          error.valids = ['value1', 'value2', 'value3'];

          const input = `ColumnLabel;
          Beatrix;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_BAD_VALUES');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({
    line: 2,
    field: 'ColumnLabel',
    valids: ['value1', 'value2', 'value3'],
});
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.length is bad_values', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'length';
          error.limit = 2;

          const input = `ColumnLabel;
          Beatrix;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_LENGTH');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'ColumnLabel', limit: 2 });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.why is date_format', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'date_format';

          const input = `ColumnLabel;
          Beatrix;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_DATE_FORMAT');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'ColumnLabel' });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.why is not_a_date', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'not_a_date';

          const input = `ColumnLabel;
          Beatrix;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_DATE_FORMAT');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'ColumnLabel' });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when error.why is email_format', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a parsing error', async function () {
          error = new Error();
          error.key = 'ColumnName';
          error.why = 'email_format';

          const input = `ColumnLabel;
          boeuf_bourguignon@chef..com;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

          const parsingError = await catchErr(parser.parse, parser)();

          expect((parsingError as $TSFixMe).code).to.equal('FIELD_EMAIL_FORMAT');
          expect((parsingError as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'ColumnLabel' });
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error including line number', async function () {
        error = new Error();
        error.key = 'ColumnName';
        error.why = 'required';

        learnerSet.addLearner = sinon.stub().onThirdCall().throws(error);
        const input = `ColumnLabel;
        Beatrix1;
        Beatrix2;
        Beatrix3;
        `;

        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

        const parsingError = await catchErr(parser.parse, parser)();

        expect((parsingError as $TSFixMe).meta.line).to.equal(4);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When file does not match requirements', function () {
    const columns = [
      new CsvColumn({ name: 'col1', label: 'Column 1', isRequired: true }),
      new CsvColumn({ name: 'col2', label: 'Column 2' }),
    ];

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the file is not csv', async function () {
      const input = `Column 1\\Column 2\\
      Beatrix\\The\\`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

      const error = await catchErr(parser.parse, parser)();

      expect((error as $TSFixMe).code).to.equal('BAD_CSV_FORMAT');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if a column is not recognized', async function () {
      const input = `Column 1;BAD Column 2;
        Beatrix;The;
        O-Ren;;
      `;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

      const error = await catchErr(parser.parse, parser)();

      expect((error as $TSFixMe).code).to.equal('HEADER_UNKNOWN');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if a required column is missing', async function () {
      const input = `Column 2;
      The;`;
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);

      const error = await catchErr(parser.parse, parser)();

      expect((error as $TSFixMe).code).to.equal('HEADER_REQUIRED');
      expect((error as $TSFixMe).meta.field).to.equal('Column 1');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the file has different encoding', function () {
    const columns = [
      new CsvColumn({ name: 'firstName', label: 'Prénom', isRequired: true, checkEncoding: true }),
      new CsvColumn({ name: 'lastName', label: 'Nom' }),
    ];

    const input = `Prénom;Nom;
      Éçéà niño véga;The;
    `;

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should parse UTF-8 encoding', function () {
      const encodedInput = iconv.encode(input, 'utf8');
      const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);
      parser.parse();
      expect(learnerSet.learners[0].firstName).to.equal('Éçéà niño véga');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should parse win1252 encoding (CSV WIN/MSDOS)', function () {
      const encodedInput = iconv.encode(input, 'win1252');
      const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);
      parser.parse();
      expect(learnerSet.learners[0].firstName).to.equal('Éçéà niño véga');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should parse macintosh encoding', function () {
      const encodedInput = iconv.encode(input, 'macintosh');
      const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);
      parser.parse();
      expect(learnerSet.learners[0].firstName).to.equal('Éçéà niño véga');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if encoding not supported', async function () {
      const encodedInput = iconv.encode(input, 'utf16');
      const parser = new CsvOrganizationLearnerParser(encodedInput, organizationId, columns, learnerSet);
      const error = await catchErr(parser.parse, parser)();

      expect((error as $TSFixMe).code).to.equal('ENCODING_NOT_SUPPORTED');
    });
  });
});
