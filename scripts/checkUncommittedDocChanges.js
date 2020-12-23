const spawnAsync = require('@expo/spawn-async');

function checkUncommittedDocChanges() {
  spawnAsync('git', ['status', '--porcelain', '../docs'], {
    stdio: 'pipe',
    cwd: __dirname,
  }).then(function (child) {
    var lines = child.stdout ? child.stdout.trim().split(/\r\n?|\n/g) : [];
    if (lines.length > 0) {
      console.error(`The following doc files need to be rebuilt and committed:`);
      lines.map(function (line) {
        console.warn(line.replace(/^\s*\S+\s*/g, ''));
      });

      throw new Error(
        `The docs folder for has uncommitted changes. Run 'yarn docs:build' and commit the docs changes.`
      );
    }
  });
}

checkUncommittedDocChanges();
