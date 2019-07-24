// from aws-cdk/lib/archive.ts

import archiver from 'archiver'
import fs from 'fs-extra'

export const zipDirectory = (directory: string, outputFile: string): Promise<void> => new Promise((ok, fail) => {
  const output = fs.createWriteStream(outputFile);
  const archive = archiver('zip');
  // The below options are needed to support following symlinks when building zip files:
  // -  nodir: This will prevent symlinks themselves from being copied into the zip.
  // - follow: This will follow symlinks and copy the files within.
  const globOptions = {
    dot: true,
    nodir: true,
    follow: true,
    cwd: directory
  };
  archive.glob('**', globOptions);
  archive.pipe(output);
  archive.finalize();

  archive.on('warning', fail);
  archive.on('error', fail);
  output.once('close', () => ok());
});
