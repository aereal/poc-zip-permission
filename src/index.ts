import {prepareZipAsset} from './asset'
import {FileAssetMetadataEntry} from '@aws-cdk/cx-api'

const assemblyDir = '.'
const asset: FileAssetMetadataEntry = {
  path: './src/artifacts/',
  id: 'artifact-test',
  packaging: 'zip',
  // sourceHash: 'bc86a4e3b402ebc7d00d4aeae2250806570262a614bf05f207e96bc60a5e41c1', // TODO
  s3BucketParameter: '<ignored>',
  s3KeyParameter: '<ignored>',
  // artifactHashParameter: '<ignored>',
};

const main = async () => {
  await prepareZipAsset(assemblyDir, asset)
}

(async () => await main())()
