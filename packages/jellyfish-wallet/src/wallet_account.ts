import BigNumber from "bignumber.js";
import { Script } from "@defichain/jellyfish-transaction";
import { OP_CODES } from "@defichain/jellyfish-transaction/dist/script";
import { WalletHdNode } from './wallet_hd_node'
import { WalletAccountDex } from "./wallet_account_dex";
import { WalletAccountToken } from "./wallet_account_token";
import { Bech32, HASH160, HRP } from "@defichain/jellyfish-crypto";
import { WalletAccountUtxo } from "./wallet_account_utxo";

/**
 * An HDW is organized as several 'accounts'.
 * Accounts are numbered, the default account ("") being number 0.
 * Account are derived from root and the pubkey to be used is `44'/1129'/${account}'/0/0`
 *
 * WalletAccount redeem script and account default to native segwit bech32 address.
 */
export abstract class WalletAccount {
  private readonly hdNode: WalletHdNode
  private readonly hrp: HRP
  public readonly utxo = new WalletAccountUtxo(this);
  public readonly dex = new WalletAccountDex(this);
  public readonly token = new WalletAccountToken(this);

  protected constructor (hdNode: WalletHdNode, hrp: HRP) {
    this.hdNode = hdNode;
    this.hrp = hrp
  }

  /**
   * @return {Promise<string>} Bech32 address of this account.
   */
  async getAddress (): Promise<string> {
    const pubKey = await this.hdNode.publicKey()
    return Bech32.fromPubKey(pubKey, this.hrp, 0x00)
  }

  /**
   * @return {Promise<Script>} redeem script of this account.
   */
  async getScript (): Promise<Script> {
    const pubKey = await this.hdNode.publicKey()
    return {
      stack: [
        OP_CODES.OP_0,
        OP_CODES.OP_PUSHDATA(HASH160(pubKey), 'little')
      ]
    }
  }

  /**
   * A WalletAccount is active when it has txn activity
   * @return Promise<boolean>
   */
  abstract isActive (): Promise<boolean>

  /**
   * Query a list of unspent that is non-exhaustive & non-paginated,
   * this is merely for crafting transaction.
   * @param {number} size of unspent to query
   */
  abstract listUnspent (size: number): Promise<WalletAccountUnspent[]>
}

export interface WalletAccountUnspent {
  txid: string
  n: number
  value: BigNumber
}

/**
 * WalletAccount uses a provider model to allow jellyfish-wallet provide an account interface from any upstream
 * provider. This keep WalletAccount implementation free from a single implementation constraint.
 */
export interface WalletAccountProvider<T extends WalletAccount> {

  /**
   * @param {WalletHdNode} hdNode of this wallet account
   * @return WalletAccount
   */
  provide: (hdNode: WalletHdNode) => T
}
