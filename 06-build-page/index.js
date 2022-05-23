const fs = require('fs');
const fsPr = require('fs/promises');
const path = require('path');
const { stdout } = process;

const dir = path.join(__dirname, 'project-dist');

async function copyStyle() {
  const outputStyle = fs.createWriteStream(path.join(dir, 'style.css'));
  const files = await fsPr.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
  files.reverse().forEach(async file => {
    if (path.extname(path.join(__dirname, 'styles', file.name)).slice(1) === 'css') {
        
      const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      let data = '';
      readableStream.on('data', chunk => data += chunk);
      readableStream.on('end', () => outputStyle.write(`${data}\n`));
      readableStream.on('error', error => console.log('Error', error.message));
    }
  });
  //stdout.write('Стили скопированы успешно.\n');
}

async function copyFile (source, where) {
  await fsPr.mkdir(where, {recursive: true});
  const files = await fsPr.readdir(source, {withFileTypes: true});
  
  files.forEach(async file => {

    if (file.isFile()) {
      await fsPr.copyFile(path.join(source, file.name), path.join(where, file.name));
    }
    else {
      copyFile(path.join(source, file.name), path.join(where, file.name));
    }
  });
}

async function replaceText (fileName, html) {
  const component = fileName.slice(0, fileName.lastIndexOf('.'));
  const data = await fsPr.readFile(path.join(__dirname, 'components', fileName));
  return html.replace(`{{${component}}}`, data.toString());
}


async function generateHTML () {
  const files = await fsPr.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
  let html = await fsPr.readFile(path.join(__dirname, 'template.html'));

  for (const file of files) {
    if (file.isFile() && path.extname(path.join(__dirname, 'components', file.name)).slice(1) === 'html') {
      html = await replaceText(file.name, html.toString());
    }
  }

  const output = fs.createWriteStream(path.join(dir, 'index.html'));
  output.write(html);
}






(async function () {
  await fsPr.rm(dir, {recursive: true, force: true});
  await fsPr.mkdir(dir, {recursive: true});

  copyStyle();
  copyFile(path.join(__dirname, 'assets'), path.join(dir, 'assets'));
  generateHTML();

}());



