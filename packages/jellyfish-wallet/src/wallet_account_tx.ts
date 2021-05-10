import { TransactionSegWit } from "@defichain/jellyfish-transaction";
import { WalletAccount } from "./wallet_account";

export class WalletAccountTx {
  // TODO(fuxingloh): target Txn
  constructor (protected readonly account: WalletAccount) {
  }

  async selectUtxo() {

  }

  async send (): Promise<void> {

  }
}

export interface SendTxResult {
  txid: string
  transaction: TransactionSegWit
}
