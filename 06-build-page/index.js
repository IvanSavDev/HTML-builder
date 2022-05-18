const path = require('path');
const fsProm = require('fs/promises');
const pathForWriter = path.join(__dirname, 'project-dist');
const pathOriginalHtml = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToAssets = path.join(__dirname, 'assets');
const pathToCopyAssets = path.join(__dirname, 'project-dist');
const pathToStyle = path.join(__dirname, 'styles');
const pathToBuildStyle = path.join(pathForWriter, 'style.css');

const copyAssetsFiles = async (sourcePath, targetPath) => {
  try {
    const elementInfo = await fsProm.stat(sourcePath);
    const elementName = path.basename(sourcePath);
    if (elementInfo.isFile()) {
      const dataFile = await fsProm.readFile(sourcePath);
      await fsProm.writeFile(path.join(targetPath, elementName), dataFile);
    } else {
      await fsProm.mkdir(path.join(targetPath, elementName), true);
      const nameElements = await fsProm.readdir(sourcePath);
      for (const nameElement of nameElements) {
        copyAssetsFiles(path.join(sourcePath, nameElement), path.join(targetPath, elementName));
      }
    }
  } catch(e) {
    if (e) throw e;
  }
};

const buildCssFiles = async (pathDirStyles, pathTargetFile) => {
  let openFile;
  try {
    openFile = await fsProm.open(pathTargetFile, 'w');
    const nameContentDir = await fsProm.readdir(pathDirStyles, {withFileTypes: true});
    const filesName = nameContentDir.filter((file) => file.isFile());
    const filesCss = filesName.filter((fileCss) => path.extname(path.join(pathDirStyles, fileCss.name)) === '.css');
    for (const fileName of filesCss) {
      const dataFile = await fsProm.readFile(path.join(pathDirStyles, fileName.name));
      await fsProm.appendFile(pathTargetFile, dataFile);
      await fsProm.appendFile(pathTargetFile, '\n');
    }
  } catch(e) {
    if (e) throw e;
  } finally {
    if (openFile !== undefined) {
      await openFile.close();
    }
  }
};

const replaceHtmlWithComponents = async () => {
  try {
    let contentHtml = await fsProm.readFile(pathOriginalHtml, 'utf8');
    const nameElementsDir = await fsProm.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    const elementIsFile = nameElementsDir.filter((element) => element.isFile());
    const elementsHtml = elementIsFile.filter((elementHtml) => path.extname(path.join(pathToComponents, `${elementHtml.name}`)) === '.html');
    const baseNameHtml = elementsHtml.map((element) => {
      const extname = path.extname(path.join(pathToComponents, `${element.name}`));
      const pathCurrentFile = path.join(pathToComponents ,`${element.name}`);
      return path.basename(pathCurrentFile, extname);
    });
    for (const nameComponent of baseNameHtml) {
      const nameComponentReg = new RegExp(`{{${nameComponent}}}`);
      const contentComponent = await fsProm.readFile(path.join(pathToComponents, `${nameComponent}.html`), 'utf8');
      contentHtml = contentHtml.replace(nameComponentReg, contentComponent);
    }
    await fsProm.writeFile(path.join(pathForWriter, 'index.html'), contentHtml);
  } catch(e) {
    if (e) throw e;
  }
};

(async () => {
  try {
    await fsProm.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    await fsProm.rm(path.join(__dirname, 'project-dist/assets'), { recursive: true, force: true });
    copyAssetsFiles(pathToAssets, pathToCopyAssets);
    buildCssFiles(pathToStyle, pathToBuildStyle);
    replaceHtmlWithComponents();
  } catch(e) {
    console.log(e);
  }
})();
