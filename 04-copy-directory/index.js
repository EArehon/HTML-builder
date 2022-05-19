const fs = require('fs/promises');
const path = require('path');
const { stdout } = process;

(async function () {
  await fs.rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true});
  await fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
  const files = await fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
  files.forEach(async file => {
    await fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
  });
  stdout.write('Файлы скопированы успешно.\n');
}());


