// import Config from './Config'
// import EncryptedCache from './caches/EncryptedCache'
// import InMemoryCache from './caches/InMemoryCache'
// import LocalStorageCache from './caches/LocalStorageCache'
// import JweAesGcmCryptoCodec from './crypto-codecs/JweAesGcmCryptoCodec'
// import WebStore from './stores/WebStore'

// const defaultConfig = () => {
//   return {
//     server: 'http://localhost:3000',
//     cache: new EncryptedCache(new InMemoryCache(), new JweAesGcmCryptoCodec())
//   }
// }

// export default class MultiBankingFileAdapter {

//   private _config: Config

//   constructor(config: Config = defaultConfig()) {
//     this._config = config
//     let cache = new LocalStorageCache('./.ls/scratch')
//     let store = new WebStore(this._config.server)
//   }

//   // async readFile(fileId: string): Promise<string> {
//   //   return ''
//   // }

//   // async writeFile(fileId: string, fileContent: string) {
//   // }

// }
