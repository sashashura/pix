// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'paginate'.
function paginate(data: $TSFixMe, { number = DEFAULT_PAGINATION.PAGE, size = DEFAULT_PAGINATION.PAGE_SIZE } = {}) {
  const pageCount = Math.ceil(data.length / size);
  const page = Math.min(Math.max(number, 1), Math.max(pageCount, 1));
  return {
    results: data.slice((page - 1) * size, page * size),
    pagination: {
      page,
      pageSize: size,
      rowCount: data.length,
      pageCount: Math.ceil(data.length / size),
    },
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { paginate };
