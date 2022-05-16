const path = require('path');
const fsProm = require('fs/promises');
const pathDirStyles = path.join(__dirname, 'styles');
const pathTargetFile = path.join(__dirname, 'project-dist/bundle.css');

(async () => {
  try {
    await fsProm.open(pathTargetFile, 'w');
    const nameContentDir = await fsProm.readdir(pathDirStyles, {withFileTypes: true});
    const filesName = nameContentDir.filter((file) => file.isFile());
    const filesCss = filesName.filter((fileCss) => path.extname(path.join(pathDirStyles, fileCss.name)) === '.css');
    for (const fileName of filesCss) {
      const dataFile = await fsProm.readFile(path.join(pathDirStyles, fileName.name));
      await fsProm.appendFile(pathTargetFile, dataFile);
      await fsProm.appendFile(pathTargetFile, '\n');
    }
  } catch(e) {
    console.log('Oops:', e);
  }
})();
