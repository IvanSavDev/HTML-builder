const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = process;
const pathNewFile = path.join(__dirname, 'newFile.txt');

const rl = readline.createInterface({ output, input });

fs.writeFile(pathNewFile, '', (err) => {
  if (err) throw err;
});

const appendToFile = (text) => {
  if (text === 'exit') {
    rl.close();
  } else {
    fs.appendFile(pathNewFile, `${text}\n`, (err) => {
      if (err) console.log(err);
    });
  }
};

rl.question('Hello, enter your text here:\n', (answer) => {
  appendToFile(answer);
});

rl.on('line', (str) => {
  appendToFile(str);
});

rl.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  console.log('Good bye');
});