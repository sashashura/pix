const findDuplicateDependencies = require('find-duplicate-dependencies');
const prettyBytes = require('pretty-bytes');
const axios = require('axios');
const packageDependencies = require('./package.json').dependencies;
const execa = require('execa');

const execSyncWithArguments = async function({ command, arguments }) {
  try {
    const value = await execa.sync(command, arguments);
    return value.stdout;
  } catch (error) {
    console.error(error);
  }
};

const nodeModuleSize = async function() {
  const dUOutput = await execSyncWithArguments({ command: 'du', arguments: ['-sb', './node_modules'] });
  const endsAt = dUOutput.indexOf('\t');
  return parseInt(dUOutput.substring(0, endsAt));
};

const packageSize = async (packageName) => {

  const sizeBefore = await nodeModuleSize();
  await uninstallPackage(packageName);
  const sizeAfter = await nodeModuleSize();
  await installPackage(packageName);

  const moduleSize = sizeBefore - sizeAfter;
  console.log(`${packageName} takes ${prettyBytes(moduleSize)}`);
  console.log(`(uninstall make node_modules to go from ${prettyBytes(sizeBefore)} to ${prettyBytes(sizeAfter)})`);
};

const uninstallPackage = async function(packageName) {
  await execSyncWithArguments({ command: 'npm', arguments: ['uninstall', packageName] });
};

const installPackage = async function(packageName) {
  await execSyncWithArguments({ command: 'npm', arguments: ['install', packageName] });
};

const find = async () => {

  const dependencies = await findDuplicateDependencies();

  const dependenciesNameCount = Object.keys(dependencies).map((dependency) => {
    return { name: dependency, count: dependencies[dependency].length };
  });

  const dependenciesNameCountSize = await Promise.all(dependenciesNameCount.map(async (dependency) => {

    // keep in touch with npmjs rate-limit
    await new Promise((resolve) => {
      setTimeout(function() {
        resolve();
      }, 200);
    });

    let response;

    try {
      response = await axios.get(`https://registry.npmjs.org/${dependency.name}`);
    } catch (error) {
      console.error(`Error while fetching from npmjs API: ${error}`);
      console.log('Exiting..');
      process.exit(1);
    }

    const versions = response.data.versions;
    const size = versions[Object.keys(versions)[Object.keys(versions).length - 1]].dist.unpackedSize;
    if (size) {
      return { ...dependency, size };
    } else {
      return {};
    }
  }));

  const dependenciesNameCountSizeRoot = dependenciesNameCountSize.filter((dependency) => packageDependencies[dependency.name]);

  dependenciesNameCountSizeRoot.sort((a, b) => {
    return (b.size - a.size);
  });

  const totalSize = dependenciesNameCountSizeRoot.reduce(function(accumulator, currentValue) {
    return accumulator + currentValue.size;
  }, 0);

  console.log('Duplicated dependencies ( a version in main package, and at least another version in transitive dependencies');
  console.log(`${dependenciesNameCountSizeRoot.length} are duplicated, total ${prettyBytes(totalSize)}`);

  for (const dependency of dependenciesNameCountSizeRoot) {
    console.log(`${dependency.name} is duplicated ${dependency.count} times, ${prettyBytes(dependency.size)} each`);
    await packageSize(dependency.name);
  }

};

(async () => {
  await find();
})();
