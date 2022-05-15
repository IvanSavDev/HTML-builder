const { readdir, stat }  = require('fs/promises');
const path = require('path');
const pathFiles = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await readdir(pathFiles, {withFileTypes: true});
    const listFiles = [];
    for (const file of files) {
      if (file.isFile()) {
        const pathCurrentFile = path.join(__dirname, 'secret-folder', file.name);
        const { size } = await stat(pathCurrentFile);
        const extName = path.extname(pathCurrentFile);
        const baseName = path.basename(pathCurrentFile, extName);
        const fileData = `${baseName} - ${extName.split('.').join('')} - ${size}byte`;
        listFiles.push(fileData);
      }
    }
    listFiles.forEach((infoData) => {
      console.log(infoData);
    });
  } catch (error) {
    console.log(error);
  }
})();
