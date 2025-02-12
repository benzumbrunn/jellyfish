import { WalletHdNode } from './wallet_hd_node'

/**
 * An HDW is organized as several 'accounts'.
 * Accounts are numbered, the default account ("") being number 0.
 * Account are derived from root and the pubkey to be used is `44'/1129'/${account}'/0/0`
 */
export interface WalletAccount {
  /**
   * @return {Promise<boolean>} whether the current account is active and has txn activity
   */
  isActive: () => Promise<boolean>

  /**
   * @return {Promise<string>} address of the wallet, for consistency sake only one address format should be used.
   */
  getAddress: () => Promise<string>

  // TODO(fuxingloh): stateless features
  //  - getUtxoBalance
  //  - listUtxo
  //  - listTransaction
  //  - listTokenBalance
  //  - getTokenBalance

  // TODO(fuxingloh): stateful features
  //  - sendUtxo
  //  - sendToken
  //  - addLiquidity
  //  - removeLiquidity
  //  - swap
  //  - fromUtxoToAccount
  //  - fromAccountToUtxo
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
