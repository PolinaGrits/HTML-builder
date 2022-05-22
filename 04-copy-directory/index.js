const fs = require('fs');
const path = require('path');

const pathDirIn = path.join(__dirname, 'files');
const pathDirOut = path.join(__dirname, 'files-copy');


fs.access(pathDirOut, (err) => {
  if (err) {
    copyFiles(); //если папки нет - создаем;
    console.log('\nFolder copied\n');
  } else {
    fs.rm(pathDirOut, { recursive: true }, (err) => { //папка зачищается и копируются новые файлы
      if (err) throw err;
      copyFiles();
      console.log('\nFiles updated\n');
    }); 
  }
});

function createDir() {
  fs.mkdir(pathDirOut, {recursive: true}, (err) => {
    if (err) console.error(err);
  });  
}

function copyFiles(){
  createDir();
  fs.readdir(pathDirIn, {withFileTypes: true}, function(err, items) {
    if (err) console.error(err);
    for (let i = 0; i < items.length; i++) {
      if (items[i].isFile()) {
        fs.copyFile(path.join(pathDirIn, items[i].name), path.join(pathDirOut, items[i].name), (err) => {
          if (err) console.error(err);
        });
      }
    }
  });
}