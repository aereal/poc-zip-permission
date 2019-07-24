// from aws-cdk/lib/assets.ts

import {tmpdir} from 'os'
import fs from 'fs-extra'
import {isAbsolute,join} from 'path'
import {debug,setVerbose} from 'aws-cdk/lib/logging'
import {FileAssetMetadataEntry} from '@aws-cdk/cx-api'

setVerbose(true)

let useCDKZipDirectory = !!process.env.USE_CDK_ZIP_DIRECTORY

export async function prepareZipAsset(
    assemblyDir: string,
    asset: FileAssetMetadataEntry
): Promise<string> {
  console.log({ useCDKZipDirectory })
  const { zipDirectory } = useCDKZipDirectory ?
    await import('aws-cdk/lib/archive') :
    await import('./archive');

  const dirPath = isAbsolute(asset.path) ? asset.path : join(assemblyDir, asset.path);
  console.log({ dirPath })

  if (!(await fs.pathExists(dirPath)) || !(await fs.stat(dirPath)).isDirectory()) {
    throw new Error(`Unable to find directory: ${dirPath}`);
  }

  debug('Preparing zip asset from directory:', dirPath);
  const staging = await fs.mkdtemp(join(tmpdir(), 'cdk-assets'));
  try {
    const archiveFile = join(staging, 'archive.zip');
    await zipDirectory(dirPath, archiveFile);
    debug('zip archive:', archiveFile);
    return archiveFile
  } finally {
    // await fs.remove(staging);
  }
}
