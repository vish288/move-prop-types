#!/usr/bin/env node
const fs = require('fs');
const fileName = process.argv.splice(2)[0];
fs.readFile(fileName, 'utf-8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  const result = `#!/usr/bin/env node \n${data}`;

  fs.writeFile(fileName, result, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
});
