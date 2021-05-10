import BigNumber from "bignumber.js";
import { WalletAccount } from "./wallet_account";

export class WalletAccountToken {
  constructor (protected readonly account: WalletAccount) {
  }

  async utxoToAccount (amount: BigNumber): Promise<void> {

  }

  async accountToUtxo (amount: BigNumber): Promise<void> {

  }

  async accountToAccount (): Promise<void> {

  }

  async listTokens (size: number): Promise<void> {

  }

  async getTokenBalance (symbol: string): Promise<TokenBalance> {

  }
}

export interface TokenBalance {
  symbol: string
}
