import { ManifestConfig, generateManifest } from 'material-icon-theme'
const config: ManifestConfig = {
  activeIconPack: 'angular',
  files: {
    associations: {
      ts: 'typescript',
      js: 'javascript'
    }
  }
}

const manifest = generateManifest(config)

export default manifest
