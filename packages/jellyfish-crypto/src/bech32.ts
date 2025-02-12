import { bech32 } from 'bech32'
import { HASH160 } from './hash'

/**
 * Human Readable Part, prefixed to all bech32/segwit native address
 *
 * df   - DeFi MainNet
 * tf   - DeFi TestNet
 * bcrt - DeFi RegTest
 */
export type HRP = 'df' | 'tf' | 'bcrt'

/**
 * @param {Buffer} hash160 to format into bech32
 * @param {'df'|'tf'|'bcrt'} hrp is the human readable part
 * @param {number} [version=0x00] witness version, OP_0
 * @return {string} bech32 encoded address
 * @see https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
 */
function toBech32 (hash160: Buffer, hrp: HRP, version: 0x00 = 0x00): string {
  const words = bech32.toWords(hash160)
  words.unshift(version)
  return bech32.encode(hrp, words)
}

/**
 * @param {string} address to decode from bech32
 * @param {'df'|'tf'|'bcrt'} hrp is the human readable part
 * @param {number} [version] witness version, OP_0
 * @return {Buffer} hash160 of the pubkey
 * @see https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
 */
function fromBech32 (address: string, hrp?: HRP, version?: 0x00): Buffer {
  const { prefix, words } = bech32.decode(address)
  if (hrp !== undefined && prefix !== hrp) {
    throw new Error('Invalid HRP: human readable part')
  }

  const witnessVersion = words.splice(0, 1)[0]
  if (version !== undefined && version !== witnessVersion) {
    throw new Error('Invalid witness version')
  }

  return Buffer.from(bech32.fromWords(words))
}

export const Bech32 = {
  /**
   * @param {Buffer} pubKey to format into bech32
   * @param {'df'|'tf'|'bcrt'} hrp is the human readable part
   * @param {number} [version=0x00] witness version, OP_0
   * @return {string} bech32 encoded address
   */
  fromPubKey (pubKey: Buffer, hrp: HRP, version: 0x00 = 0x00): string {
    const hash = HASH160(pubKey)
    return toBech32(hash, hrp, version)
  },
  /**
   * @param {Buffer} hash160 to format into bech32
   * @param {'df'|'tf'|'bcrt'} hrp is the human readable part
   * @param {number} [version=0x00] witness version, OP_0
   * @return {string} bech32 encoded address
   */
  fromHash160 (hash160: Buffer, hrp: HRP, version: 0x00 = 0x00) {
    return toBech32(hash160, hrp, version)
  },
  /**
   * @param {string} address to decode from bech32
   * @param {'df'|'tf'|'bcrt'} hrp is the human readable part
   * @param {number} [version] witness version, OP_0
   * @return {Buffer} hash160 of the pubkey
   */
  toHash160 (address: string, hrp?: HRP, version?: 0x00): Buffer {
    return fromBech32(address, hrp, version)
  }
}
