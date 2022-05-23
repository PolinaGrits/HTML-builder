const fs = require('fs');
const path = require('path');
const promise = require('fs/promises');
const project = path.join(__dirname, 'project-dist');
const projectAssetsOut = path.join(__dirname, './project-dist/assets');
const projectAssetsIn = path.join(__dirname, 'assets');
const projectStyles = path.join(__dirname, 'styles');
let style = fs.createWriteStream(path.join(__dirname, '/project-dist/style.css'));
let indexStrem = fs.createWriteStream(path.join(__dirname, '/project-dist/index.html'));
const temp = path.join(__dirname, 'template.html');

//создаем папку project-dist
async function createProject() {
  fs.mkdir(project, {recursive: true}, (err) => {
    if (err) console.error(err);
  });  
  await copyFiles(projectAssetsIn, projectAssetsOut);
  await copyStyle();
  await createIndex();
}
createProject();

//создаем копию папки assets
async function copyFiles(pathIn, pathOut) {
  await promise.rm(pathOut, {recursive: true, force: true});
  await promise.mkdir(pathOut);
  const assets = await promise.readdir(pathIn, { withFileTypes: true });
  assets.forEach(async (asset) => {
    if (asset.isFile()) {
      await promise.copyFile(path.join(pathIn, asset.name), path.join(pathOut, asset.name));
    } else {
      await copyFiles(path.join(pathIn, asset.name), path.join(pathOut, asset.name));
    }
  });
}

//копируем стили в style.css
async function copyStyle(){
  fs.readdir(projectStyles, {withFileTypes: true}, function(err, items) {
    if (err) throw err;
    for (let i = 0; i < items.length; i++){
      if (items[i].isFile()) {
        let item = path.join(projectStyles, items[i].name);
        if (path.extname(item) === '.css') {
          let file = fs.createReadStream(item);
          file.pipe(style);
        }
      }
    }
  });
}

//создадим объект values, в котором лежат значения компонент
const createHTML = async function() {
  const values = {};
  const componentsPath = path.join(__dirname, 'components');
  const components = await promise.readdir(componentsPath, { withFileTypes: true });
  for (let i = 0; i < components.length; i++) {
    const file = path.join(componentsPath, components[i].name);
    if (components[i].isFile() && (path.extname(file) === '.html')) {
      const data = await fs.promises.readFile(file);
      values[components[i].name] = data.toString();
    }
  }
  return values;
};

//объединение values и index.html
async function createIndex() {
  const components = await createHTML();
  fs.readFile(temp, 'utf-8', (err, data) => {
    if (err) throw err;
    let value = data;
    for (let item of Object.keys(components)) {
      value = value.replace(`{{${item.split('.')[0]}}}`, components[item]);
      
    }
    indexStrem.write(value);
  });
}
