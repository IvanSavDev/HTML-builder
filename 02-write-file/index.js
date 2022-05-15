const fs = require('fs');
const path = require('path');
const { exit, stdin, stdout } = process;
const pathNewFile = path.join(__dirname, 'newFile.txt');

stdout.write('Hello, enter your text here\n');

fs.writeFile(pathNewFile, '', (err) => {
  if (err) throw err;
});

stdin.on('data', (data) => {
  if (data.toString().split('\n').join('') === 'exit') {
    exit();
  }

  fs.appendFile(pathNewFile, data, (error) => {
    if (error) {
      stdout.write(`Oops, can\`t append file: ${error}`);
    }
  });
});

process.on('exit', (code) => {
  if (code === 0) {
    stdout.write('Good bye\n');
  } else {
    stdout.write(`Something went wrong and the program ended with the code: ${code}\n`);
  }
});

process.on('SIGINT', (signal) => {
  if (signal === 'SIGINT') {
    stdout.write('\n');
    exit();
  }
});
