const cronContent = {
  jobs: [],
};

// @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
if (process.env.CACHE_RELOAD_TIME) {
  cronContent.jobs.push({
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
    command: `${process.env.CACHE_RELOAD_TIME} npm run cache:refresh`,
  });
}
// @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
console.log(JSON.stringify(cronContent));
