const path = require('path');
const fs = require('fs');
const pathDir = path.join(__dirname, 'styles');
let bundle = fs.createWriteStream(path.join(__dirname, '/project-dist/bundle.css'));

fs.readdir(pathDir, {withFileTypes: true}, function(err, items) {
  if (err) throw err;
  for (let i = 0; i < items.length; i++){
    if (items[i].isFile()) {
      let item = path.join(pathDir, items[i].name);
      if (path.extname(item) === '.css') {
        let file = fs.createReadStream(item);
        file.pipe(bundle);
      }
    }
  }
});