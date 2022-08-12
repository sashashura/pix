// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.raw(`UPDATE "certification-issue-reports"
                  SET  "resolvedAt" = NOW()
                  WHERE id IN
                  (
                      SELECT r.id FROM "certification-issue-reports" r
                          INNER JOIN "certification-courses" c ON c.id = r."certificationCourseId"
                          INNER JOIN "sessions" s ON s.id = c."sessionId"
                      WHERE 1=1
                        AND s."finalizedAt" IS NOT NULL
                        AND r."resolvedAt" IS NULL
                  )`);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  return;
};
