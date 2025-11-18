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
const packageJson = {
  type: 'module',
  imports: {
    '#q-app/wrappers': './q-app-wrappers.js',
  },
};

fs.writeFileSync(path.join(baseDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
fs.writeFileSync(
  path.join(baseDir, 'q-app-wrappers.js'),
  'export const defineBoot = (fn) => fn;\n',
  'utf8'
);
