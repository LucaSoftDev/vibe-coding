const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', '.test-dist');
const nodeModulesDir = path.join(baseDir, 'node_modules');

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const writeStub = (moduleName, content) => {
  const targetDir = path.join(nodeModulesDir, moduleName);
  ensureDir(targetDir);
  fs.writeFileSync(path.join(targetDir, 'index.js'), content, 'utf8');
};

ensureDir(baseDir);
fs.writeFileSync(path.join(baseDir, 'package.json'), JSON.stringify({ type: 'commonjs' }), 'utf8');

writeStub(
  'reflect-metadata',
  'module.exports = {};'
);

writeStub(
  'class-transformer',
  `
const noopDecorator = () => () => undefined;

exports.Expose = noopDecorator;
exports.Transform = noopDecorator;

exports.plainToInstance = function (Cls, payload) {
  const instance = new Cls();
  if (payload && typeof payload === 'object') {
    Object.assign(instance, payload);
    if (typeof payload.title === 'string' && instance.name === undefined) {
      instance.name = payload.title;
    }
  }
  return instance;
};
`.trim(),
);

writeStub(
  'class-validator',
  `
const noopDecorator = () => () => undefined;

exports.IsBoolean = noopDecorator;
exports.IsInt = noopDecorator;
exports.IsNumber = noopDecorator;
exports.IsOptional = noopDecorator;
exports.IsString = noopDecorator;
exports.Min = noopDecorator;
exports.MinLength = noopDecorator;

exports.validateOrReject = async function () {
  return;
};
`.trim(),
);

writeStub(
  '#q-app/wrappers',
  'exports.defineBoot = function (fn) { return fn; };'
);
