import BigNumber from 'bignumber.js'
import { ApiClient } from '../.'

/**
 * Blockchain RPCs for DeFi Blockchain
 */
export class Blockchain {
  private readonly client: ApiClient

  constructor (client: ApiClient) {
    this.client = client
  }

  /**
   * Get various state info regarding blockchain processing.
   *
   * @return {Promise<BlockchainInfo>}
   */
  async getBlockchainInfo (): Promise<BlockchainInfo> {
    return await this.client.call('getblockchaininfo', [], 'number')
  }

  /**
   * Get a hash of block in best-block-chain at height provided.
   *
   * @param {number} height
   * @return {Promise<string>}
   */
  async getBlockHash (height: number): Promise<string> {
    return await this.client.call('getblockhash', [height], 'number')
  }

  /**
   * Get the height of the most-work fully-validated chain.
   *
   * @return {Promise<number>}
   */
  async getBlockCount (): Promise<number> {
    return await this.client.call('getblockcount', [], 'number')
  }

  /**
   * Get block string hex with a provided block header hash.
   *
   * @param {string} hash of the block
   * @param {number} verbosity 0
   * @return {Promise<string>} block as string that is serialized, hex-encoded data
   */
  getBlock (hash: string, verbosity: 0): Promise<string>

  /**
   * Get block data with a provided block header hash.
   *
   * @param {string} hash of the block
   * @param {number} verbosity 1
   * @return {Promise<Block<string>>} block information with transaction as txid
   */
  getBlock (hash: string, verbosity: 1): Promise<Block<string>>

  /**
   * Get block data with a provided block header hash.
   *
   * @param {string} hash of the block
   * @param {number} verbosity 2
   * @return {Promise<Block<Transaction>>} block information and detailed information about each transaction.
   */
  getBlock (hash: string, verbosity: 2): Promise<Block<Transaction>>

  async getBlock<T> (hash: string, verbosity: 0 | 1 | 2): Promise<string | Block<T>> {
    return await this.client.call('getblock', [hash, verbosity], verbosity === 2 ? {
      tx: {
        vout: {
          value: 'bignumber'
        }
      }
    } : 'number')
  }

  /**
   * Get block header data with particular header hash.
   * Returns an Object with information for block header.
   *
   * @param {string} hash of the block
   * @param {boolean} verbosity true
   * @return {Promise<BlockHeader>}
   */
  getBlockHeader (hash: string, verbosity: true): Promise<BlockHeader>

  /**
   * Get block header data with particular header hash.
   * Returns a string that is serialized, hex-encoded data for block header.
   *
   * @param {string} hash of the block
   * @param {boolean} verbosity false
   * @return {Promise<string>}
   */
  getBlockHeader (hash: string, verbosity: false): Promise<string>

  async getBlockHeader (hash: string, verbosity: boolean): Promise<string | BlockHeader> {
    return await this.client.call('getblockheader', [hash, verbosity], 'number')
  }

  /**
   * Return information about all known tips in the block tree
   * including the main chain as well as orphaned branches.
   *
   * @return {Promise<ChainTip[]>}
   */
  async getChainTips (): Promise<ChainTip[]> {
    return await this.client.call('getchaintips', [], 'number')
  }

  /**
   * Get details of unspent transaction output (UTXO).
   *
   * @param {string} txId the transaction id
   * @param {number} index vout number
   * @param {boolean} includeMempool default true, whether to include mempool
   * @return {Promise<UTXODetails>}
   */
  async getTxOut (txId: string, index: number, includeMempool = true): Promise<UTXODetails> {
    return await this.client.call('gettxout', [
      txId, index, includeMempool
    ], {
      value: 'bignumber'
    })
  }

  /**
   * Get all transaction ids in memory pool as string
   *
   * @param {boolean} verbose false
   * @return {Promise<string[]>}
   */
  getRawMempool (verbose: false): Promise<string[]>

  /**
   * Get all transaction ids in memory pool as json object
   *
   * @param {boolean} verbose true
   * @return {Promise<MempoolTx>}
   */
  getRawMempool (verbose: true): Promise<MempoolTx>

  /**
   * Get all transaction ids in memory pool as string[] if verbose is false
   * else as json object
   *
   * @param {boolean} verbose default = false, true for json object, false for array of transaction ids
   * @return {Promise<string[] | MempoolTx>}
   */
  async getRawMempool (verbose: boolean): Promise<string[] | MempoolTx> {
    return await this.client.call('getrawmempool', [verbose], 'bignumber')
  }
}

/**
 * TODO(fuxingloh): defid prune=1 is not type supported yet
 */
export interface BlockchainInfo {
  chain: 'main' | 'test' | 'regtest' | string
  blocks: number
  headers: number
  bestblockhash: string
  difficulty: number
  mediantime: number
  verificationprogress: number
  initialblockdownload: boolean
  chainwork: string
  size_on_disk: number
  pruned: boolean
  softforks: {
    [id: string]: {
      type: 'buried' | 'bip9'
      active: boolean
      height: number
    }
  }
  warnings: string
}

export interface Block<T> {
  hash: string
  confirmations: number
  strippedsize: number
  size: number
  weight: number
  height: number
  masternode: string
  minter: string
  mintedBlocks: number
  stakeModifier: string
  version: number
  versionHex: string
  merkleroot: string
  time: number
  mediantime: number
  bits: string
  difficulty: number
  chainwork: string
  tx: T[]
  nTx: number
  previousblockhash: string
  nextblockhash: string
}

export interface BlockHeader {
  hash: string
  confirmations: number
  height: number
  version: number
  versionHex: string
  merkleroot: string
  time: number
  mediantime: number
  bits: string
  difficulty: number
  chainwork: string
  nTx: number
  previousblockhash: string
  nextblockhash: string
}

export interface Transaction {
  txid: string
  hash: string
  version: number
  size: number
  vsize: number
  weight: number
  locktime: number
  vin: Vin[]
  vout: Vout[]
  hex: string
}

export interface Vin {
  coinbase: string
  txid: string
  vout: number
  scriptSig: {
    asm: string
    hex: string
  }
  txinwitness: string[]
  sequence: string
}

export interface Vout {
  value: BigNumber
  n: number
  scriptPubKey: ScriptPubKey
  tokenId: number
}

export interface UTXODetails {
  bestblock: string
  confirmations: number
  value: BigNumber
  scriptPubKey: ScriptPubKey
  coinbase: boolean
}

export interface ScriptPubKey {
  asm: string
  hex: string
  type: string
  reqSigs: number
  addresses: string[]
}

export interface ChainTip {
  height: number
  hash: string
  branchlen: number
  status: string
}

export interface MempoolTx {
  [key: string]: {
    vsize: BigNumber
    /**
     * @deprecated same as vsize. Only returned if defid is started with -deprecatedrpc=size
     */
    size: BigNumber
    weight: BigNumber
    fee: BigNumber
    modifiedfee: BigNumber
    time: BigNumber
    height: BigNumber
    descendantcount: BigNumber
    descendantsize: BigNumber
    descendantfees: BigNumber
    ancestorcount: BigNumber
    ancestorsize: BigNumber
    ancestorfees: BigNumber
    wtxid: string
    fees: {
      base: BigNumber
      modified: BigNumber
      ancestor: BigNumber
      descendant: BigNumber
    }
    depends: string[]
    spentby: string[]
    'bip125-replaceable': boolean
  }
}
