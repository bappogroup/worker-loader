'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getWorker = (file, content, options) => {
  const publicPath = options.publicPath ? JSON.stringify(options.publicPath) : '__webpack_public_path__';

  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  const defineGlobalContent = options.defineGlobal ? `\`${Object.entries(options.defineGlobal).map(([name, value]) => `self.${name}=\${JSON.stringify(${value})};`).join('\n')}\`` : '';

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(`!!${_path2.default.join(__dirname, 'InlineWorker.js')}`);

    const fallbackWorkerPath = options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${defineGlobalContent} + ${JSON.stringify(content)}, ${fallbackWorkerPath})`;
  }

  if (options.crossOrigin) {
    const InlineWorkerPath = JSON.stringify(`!!${_path2.default.join(__dirname, 'InlineWorker.js')}`);

    const fallbackWorkerPath = options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${defineGlobalContent} + 'importScripts("' + ${publicWorkerPath} + '")', ${fallbackWorkerPath})`;
  }

  return `new Worker(${publicWorkerPath})`;
}; /* eslint-disable multiline-ternary */
exports.default = getWorker;