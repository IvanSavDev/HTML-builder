const fs = require('fs/promises');
const path = require('path');
const pathOriginDir = path.join(__dirname, 'files');
const pathCopyDir = path.join(__dirname, 'files-copy');

fs.mkdir(pathCopyDir)
  .catch((error) => error.code)
  .then((exist) => {
    if (exist === 'EEXIST') {
      return fs.readdir(pathCopyDir);
    } else {
      return 'noExist';
    }
  })
  .then((nameFiles) => {
    if (nameFiles !== 'noExist') {
      for (const nameFile of nameFiles) {
        fs.unlink(path.join(pathCopyDir, nameFile), err => {
          if (err) throw err;
        });
      }
    }
  })
  .then(() => fs.readdir(pathOriginDir))
  .then((files) => {
    files.forEach((file) => {
      fs.copyFile(path.join(pathOriginDir, file), path.join(pathCopyDir, file));
    });
  })
  .catch((error) => console.log(error));
