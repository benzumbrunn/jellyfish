import BigNumber from "bignumber.js";
import { WalletAccount } from "./wallet_account";

export class WalletAccountToken {
  constructor (protected readonly account: WalletAccount) {
  }

  async utxoToAccount (amount: BigNumber): Promise<void> {

  }

  async accountToUtxo (amount: BigNumber): Promise<void> {

  }

  async accountToAccount (address: string, tokenId: number, amount: BigNumber): Promise<void> {

  }
}
