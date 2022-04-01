
const { knex } = require('../../db/knex-database-connection');

const moment = require('moment');
const NB_LINES = 100000;
const TOTAL_LINES = NB_LINES*4;
const BATCH_SIZE = 1000;

async function main() {
  const userIds =  await knex('users').pluck('id');

  console.log('Data Creation', '');

  let lines_created = 0;
  log('0 %')
  for(let batch = 0; batch < NB_LINES/BATCH_SIZE ; batch++) {
    const data = [];
    for(let i = 0; i < BATCH_SIZE; i++) {
      const days = (i % 5) - 2;
      const startedAt = moment('2022-03-01').add(days, 'days')

      data.push({
        name: `Name-${i+(BATCH_SIZE*batch)}`,
        userId: userIds[i % userIds.length],
        startedAt,
      });
    }


    await knex.batchInsert('table-test', data);
    lines_created += BATCH_SIZE;
    log(`${progress(lines_created)} %`)

    await knex.batchInsert('table-test', data);
    lines_created += BATCH_SIZE;
    log(`${progress(lines_created)} %`)

    await knex.batchInsert('table-test-A', data);
    lines_created += BATCH_SIZE;
    log(`${progress(lines_created)} %`)

    await knex.batchInsert('table-test-B', data);
    lines_created += BATCH_SIZE;
    log(`${progress(lines_created)} %`)

  }
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
}

function log(value) {
  process.stdout.cursorTo(0);
  process.stdout.write(value);
}


function progress(i) {
  return Math.round(i/TOTAL_LINES * 100, 2);
}
