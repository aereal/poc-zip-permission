import {prepareZipAsset} from './asset'
import {FileAssetMetadataEntry} from '@aws-cdk/cx-api'
import {spawnSync} from 'child_process'
import {accessSync,constants} from 'fs'

const assemblyDir = '.'
const asset: FileAssetMetadataEntry = {
  path: './src/artifacts/',
  id: 'artifact-test',
  packaging: 'zip',
  sourceHash: 'bc86a4e3b402ebc7d00d4aeae2250806570262a614bf05f207e96bc60a5e41c1', // TODO
  s3BucketParameter: '<ignored>',
  s3KeyParameter: '<ignored>',
  artifactHashParameter: '<ignored>',
};

const main = async () => {
  let zipPath: string
  try {
    zipPath = await prepareZipAsset(assemblyDir, asset)
  } catch (err) {
    console.error({ err })
    return;
  }

  const executablePath = './executable'
  try {
    spawnSync('unzip', [zipPath])
    try {
      accessSync(executablePath, constants.S_IXGRP | constants.S_IXOTH | constants.S_IXUSR)
      console.log(`${executablePath} is executable`)
    } catch (err) {
      console.log(`${executablePath} is NOT executable`)
    }
  } finally {
    console.log(`cleanup ${executablePath}`)
    spawnSync('rm', ['-f', executablePath])
    console.log(`cleanup zip`)
    spawnSync('rm', ['-f', zipPath])
  }
}

(async () => await main())()
