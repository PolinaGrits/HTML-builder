
const path = require('path');
const fs = require('fs');
const pathDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathDir, {withFileTypes: true}, function(err, items) {
  if (err) throw err;
  for (let i = 0; i < items.length; i++) {
    if (items[i].isFile()){
      fs.stat(path.join(pathDir, items[i].name), (err, item) => {
        if (err) throw err;
        let itemSize = (item.size / 1024).toFixed(3);
        console.log(`${items[i].name.split('.')[0]} - ${path.extname(items[i].name).slice(1)} - ${itemSize}kb`);
      });
    }
  }
});
