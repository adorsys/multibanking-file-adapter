export default interface CryptoCodec {
  encrypt(data: string): Promise<string>
  decrypt(cipher: string): Promise<string>
}
