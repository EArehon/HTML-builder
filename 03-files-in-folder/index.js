const fs = require('fs/promises');
const path = require('path');
const { stdout } = process;

const dir = path.join(__dirname, 'secret-folder');

(async function () {
  const files = await fs.readdir(dir, {withFileTypes: true});
  files.forEach(async file => {
    if (file.isFile()) {
      const data = await fs.stat(path.join(dir, file.name));
      const name = file.name.slice(0, file.name.lastIndexOf('.'));
      const ext = path.extname(path.join(dir, file.name)).slice(1);
      const size = data.size / 1024;
      stdout.write(`${name} - ${ext} - ${Math.trunc(size)}kb\n`);
    }
  });
}());