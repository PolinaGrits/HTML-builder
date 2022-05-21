const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
let writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Hello! Write something here\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  writeableStream.write(data);
});
process.on('exit', () => stdout.write('Thanks!'));
process.on('SIGINT', () => process.exit());
