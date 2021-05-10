import BigNumber from "bignumber.js";
import { WalletAccount } from "./wallet_account";

export class WalletAccountUtxo {
  constructor (protected readonly account: WalletAccount) {
  }

  async send (address: string, amount: BigNumber) {

  }

  async getBalance (): Promise<BigNumber> {

  }
}
