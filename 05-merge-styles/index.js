const fsPr = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { stdout } = process;

const dir = path.join(__dirname, 'styles');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

(async function () {
  const files = await fsPr.readdir(dir, {withFileTypes: true});
  files.forEach(async file => {
    if (path.extname(path.join(dir, file.name)).slice(1) === 'css') {
      
      const readableStream = fs.createReadStream(path.join(dir, file.name), 'utf-8');
      let data = '';
      readableStream.on('data', chunk => data += chunk);
      readableStream.on('end', () => output.write(`${data}\n`));
      //readableStream.on('end', () => console.log(data));
      readableStream.on('error', error => console.log('Error', error.message));
    }
  });
  stdout.write('Файлы скопированы успешно.\n');
}());