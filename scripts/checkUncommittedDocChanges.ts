import spawnAsync from '@expo/spawn-async';

async function checkUncommittedDocChanges() {
  const child = await spawnAsync('git', ['status', '--porcelain', '../docs'], {
    stdio: 'pipe',
    cwd: __dirname,
  });

  const lines = child.stdout?.trim().split(/\r\n?|\n/g) ?? [];
  if (lines.length > 0) {
    console.error(`The following doc files need to be rebuilt and committed:`);
    lines.map(function (line) {
      console.warn(line.replace(/^\s*\S+\s*/g, ''));
    });

    throw new Error(
      `The docs folder for has uncommitted changes. Run 'bun docs:build' and commit the docs changes.`
    );
  }
}

checkUncommittedDocChanges();
