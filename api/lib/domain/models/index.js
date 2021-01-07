const path = require('path');
const fs = require('fs');

function exportModels(dirname) {
  // eslint-disable-next-line no-sync
  fs.readdirSync(dirname).forEach(function(file) {
    if (file === 'index.js') return;
    const filePath = path.join(dirname, file);
    // eslint-disable-next-line no-sync
    if (fs.lstatSync(filePath).isDirectory()) {
      exportModels(filePath);
    } else {
      module.exports[path.basename(file, '.js')] = require(filePath);
    }
  });
}

exportModels(__dirname);
