/* eslint-disable multiline-ternary */
import path from 'path';

const getWorker = (file, content, options) => {
  const publicPath = options.publicPath
    ? JSON.stringify(options.publicPath)
    : '__webpack_public_path__';

  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  const defineGlobalContent = options.defineGlobal
    ? `\`${Object.entries(options.defineGlobal)
        .map(([name, value]) => `self.${name}=\${JSON.stringify(${value})};`)
        .join('\n')}\``
    : '';

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(
      `!!${path.join(__dirname, 'InlineWorker.js')}`
    );

    const fallbackWorkerPath =
      options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${defineGlobalContent} + ${JSON.stringify(
      content
    )}, ${fallbackWorkerPath})`;
  }

  if (options.crossOrigin) {
    const InlineWorkerPath = JSON.stringify(
      `!!${path.join(__dirname, 'InlineWorker.js')}`
    );

    const fallbackWorkerPath =
      options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${defineGlobalContent} + 'importScripts("' + ${publicWorkerPath} + '")', ${fallbackWorkerPath})`;
  }

  return `new Worker(${publicWorkerPath})`;
};

export default getWorker;
