const {series} = require('gulp');
const fs = require('node:fs/promises');

const mfName = process.env.MF_NAME;

async function hasBrowserFolder() {
  try {
    return fs.stat(`dist/${mfName}/browser/`)
      .then(() => true)
      .catch(() => false);
  } catch (e) {
    console.log(e);
  }
}

async function createEntry() {
  try {
    const hasBrowser = await hasBrowserFolder();
    const dir = hasBrowser ? `dist/${mfName}/browser` : `dist/${mfName}`;
    const fileList = (await fs.readdir(dir)).filter(f => f.endsWith(`.js`));

    const predefinedFiles = ['runtime.js', 'polyfills.js', 'scripts.js', 'main.js'];
    let content = ``;

    predefinedFiles.forEach(pf => {
      if (fileList.find(f => f === pf)) {
        content = `${content}\nimport \'./${pf}\';`.trim();
      }
    });
    return fs.writeFile(`${dir}/index.js`, content);
  } catch (e) {
    console.log(e);
  }
}

async function copyFiles() {
  try {
    const hasBrowser = await hasBrowserFolder();
    const dir = hasBrowser ? `dist/${mfName}/browser` : `dist/${mfName}/`;
    return fs.cp(dir, `projects/shell/public/elements/${mfName}`, {recursive: true});
  } catch (e) {
    console.log(e);
  }
}

exports.default = series(createEntry, copyFiles);
