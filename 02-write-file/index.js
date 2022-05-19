const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите текст для записи в файл:\n');

stdin.on('data', data => {
  const dataStringified = data.toString().trim();
  if (dataStringified === 'exit') process.exit();
  output.write(`${dataStringified}\n`);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));